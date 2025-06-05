"use client"; // This component needs to be rendered on the client

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapStateType, useMapStore } from "@/store/map-store"; // We'll create this store soon
import type { GeoJsonObject, FeatureCollection, Point, Polygon } from "geojson";

// Fix default icon issues with Leaflet and Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
  iconUrl: "leaflet/images/marker-icon.png",
  shadowUrl: "leaflet/images/marker-shadow.png",
});

interface DynamicMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  selectedLayers: string[]; // From the checkboxes
}

// Map Controls component (for zoom/locate)
function MapControls() {
  const map = useMap();
  const { setMapState } = useMapStore(); // To update store with current map center

  // Update store on map moveend
  useMapEvents({
    moveend: () => {
      setMapState({
        latitude: map.getCenter().lat,
        longitude: map.getCenter().lng,
        zoom: map.getZoom(),
      });
    },
  });

  const zoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);

  const zoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);

  const goToCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.setView(
            [position.coords.latitude, position.coords.longitude],
            map.getZoom()
          );
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Could not get your current location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [map]);

  // Icons for map controls (Plus, Minus, NavigationArrow)
  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
    </svg>
  );
  const MinusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
    </svg>
  );
  const NavigationArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      fill="currentColor"
      viewBox="0 0 256 256"
      transform="scale(-1, 1)"
    >
      <path d="M229.33,98.21,53.41,33l-.16-.05A16,16,0,0,0,32.9,53.25a1,1,0,0,0,.05.16L98.21,229.33A15.77,15.77,0,0,0,113.28,240h.3a15.77,15.77,0,0,0,15-11.29l23.56-76.56,76.56-23.56a16,16,0,0,0,.62-30.38ZM224,113.3l-76.56,23.56a16,16,0,0,0-10.58,10.58L113.3,224h0l-.06-.17L48,48l175.82,65.22.16.06Z"></path>
    </svg>
  );

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-col gap-0.5">
        <button
          onClick={zoomIn}
          className="flex size-10 items-center justify-center rounded-t-lg bg-[#fafbf9] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          <div className="text-[#131810]">
            <PlusIcon />
          </div>
        </button>
        <button
          onClick={zoomOut}
          className="flex size-10 items-center justify-center rounded-b-lg bg-[#fafbf9] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          <div className="text-[#131810]">
            <MinusIcon />
          </div>
        </button>
      </div>
      <button
        onClick={goToCurrentLocation}
        className="flex size-10 items-center justify-center rounded-lg bg-[#fafbf9] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      >
        <div className="text-[#131810]">
          <NavigationArrowIcon />
        </div>
      </button>
    </div>
  );
}

export function DynamicMap({
  initialCenter = [0, 0],
  initialZoom = 2,
  selectedLayers,
}: DynamicMapProps) {
  const { mapState, setMapState } = useMapStore();
  const goToLocation = mapState.goToLocation;
  const mapRef = useRef<L.Map | null>(null);

  // Effect to update map view when goToLocation changes
  useEffect(() => {
    if (
      mapRef.current &&
      goToLocation.latitude !== null &&
      goToLocation.longitude !== null
    ) {
      mapRef.current.setView(
        [goToLocation.latitude, goToLocation.longitude],
        goToLocation.zoom || mapRef.current.getZoom()
      );
      // Reset goToLocation after moving
      setMapState({
        goToLocation: { latitude: null, longitude: null, zoom: null },
      });
    }
  }, [goToLocation, setMapState]);

  const dummyGroundwaterData = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Groundwater Well 1", level: "High" },
          geometry: { type: "Point", coordinates: [30, 0] },
        },
        {
          type: "Feature",
          properties: { name: "Groundwater Well 2", level: "Medium" },
          geometry: { type: "Point", coordinates: [35, 5] },
        },
      ],
    }),
    []
  );

  const dummyAquiferData = useMemo<FeatureCollection<Polygon>>(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Aquifer Zone A" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [20, 0],
                [25, 0],
                [25, 5],
                [20, 5],
                [20, 0],
              ],
            ],
          },
        },
      ],
    }),
    []
  );

  const dummySoilPermeabilityData = useMemo<FeatureCollection<Polygon>>(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "High Permeability Area" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [10, -10],
                [15, -10],
                [15, -5],
                [10, -5],
                [10, -10],
              ],
            ],
          },
        },
      ],
    }),
    []
  );

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`<b>${feature.properties.name}</b>`);
    }
    if (feature.geometry.type === "Polygon") {
      (layer as L.Path).setStyle({
        color: "blue",
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.3,
      });
    } else if (feature.geometry.type === "Point") {
      // You might want custom icons for points based on data, etc.
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="flex-1 w-full @[480px]:rounded-lg min-h-[320px]"
        ref={mapRef}
        whenReady={() => {
          if (mapRef.current) {
            setMapState({
              latitude: mapRef.current.getCenter().lat,
              longitude: mapRef.current.getCenter().lng,
              zoom: mapRef.current.getZoom(),
            });
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Basic OpenStreetMap tiles
        />

        {/* You can add different base layers here, e.g., satellite from another provider */}
        {/* <TileLayer
          attribution='&copy; <a href="http://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        /> */}

        {selectedLayers.includes("Groundwater Levels") && (
          <GeoJSON
            data={dummyGroundwaterData}
            onEachFeature={onEachFeature}
            style={() => ({ color: "#007bff" })}
          />
        )}
        {selectedLayers.includes("Aquifer Recharge Zones") && (
          <GeoJSON
            data={dummyAquiferData}
            onEachFeature={onEachFeature}
            style={() => ({ color: "#28a745" })}
          />
        )}
        {selectedLayers.includes("Soil Permeability") && (
          <GeoJSON
            data={dummySoilPermeabilityData}
            onEachFeature={onEachFeature}
            style={() => ({ color: "#ffc107" })}
          />
        )}

        {/* This is the Search box overlaid on the map */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[400px]">
          {/* TODO: Replace with actual SearchInputWithIcon component */}
          <input
            type="text"
            className="h-12 w-full px-4 rounded-lg border border-gray-300 bg-[#fafbf9] focus:outline-none"
            placeholder="Search for a location"
            onChange={(e) => {
              /* Implement geocoding search here */
            }}
          />
        </div>

        {/* Map controls (zoom, locate) */}
        <div className="absolute bottom-6 right-8 z-[1000]">
          <MapControls />
        </div>
      </MapContainer>
    </div>
  );
}
