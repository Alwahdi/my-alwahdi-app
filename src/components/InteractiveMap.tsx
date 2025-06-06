"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup, // Make sure Popup is imported
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { groundwaterWells } from "@/lib/data/wellData";
import { rainfallZones } from "@/lib/data/rainfallData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define map providers with their names, URLs, and attributions
const mapProviders = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  esri: {
    name: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  google: {
    name: "Google Maps",
    url: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}/{z}/", // Note: sometimes Google uses /lyrs=m&x={x}&y={y}&z={z}
    attribution: "Map data &copy; Google",
  },
};

// Component to recenter the map programmatically
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const InteractiveMap = () => {
  const [activeProvider, setActiveProvider] = useState(mapProviders.osm);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    15.3694, 44.191,
  ]);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [showGroundwaterWells, setShowGroundwaterWells] = useState(true);
  const [showRainfallZones, setShowRainfallZones] = useState(true);
  const mapRef = useRef<any>(null); // This ref is not actively used in the current setup but can be useful.

  // Style for polygons (rainfall zones)
  const styleGeoJson = {
    color: "blue",
    weight: 2,
    fillOpacity: 0.1,
  };

  // Custom icon for groundwater wells
  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    const quality = feature.properties.quality || "good";
    const iconUrl =
      quality === "poor" ? "/well-icon-red.png" : "/well-icon.png";
    const icon = L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32], // Correctly positions the popup relative to the icon
    });
    return L.marker(latlng, { icon });
  };

  // OnEachFeature handler for both wells and rainfall zones
  const onEachFeature = (feature: any, layer: L.Layer) => {
    // Determine coordinates for recentering
    const coords: [number, number] =
      feature.geometry.type === "Point"
        ? [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
        : [
            feature.geometry.coordinates[0][0][1],
            feature.geometry.coordinates[0][0][0],
          ];

    // Create popup content based on feature properties
    let popupContent = `
      <div>
        <strong>${
          feature.properties?.name || feature.properties?.id || "No Name"
        }</strong><br/>
    `;

    if (feature.properties?.level)
      popupContent += `المستوى: ${feature.properties.level}<br/>`;
    if (feature.properties?.quality)
      popupContent += `الجودة: ${feature.properties.quality}<br/>`;
    if (feature.properties?.risk)
      popupContent += `المخاطر: ${feature.properties.risk}<br/>`;
    if (feature.properties?.last_measured)
      popupContent += `آخر قياس: ${feature.properties.last_measured}<br/>`;
    if (feature.properties?.rainfall_mm)
      popupContent += `معدل الأمطار: ${feature.properties.rainfall_mm} ملم<br/>`;
    if (feature.properties?.month)
      popupContent += `الشهر: ${feature.properties.month}<br/>`;
    if (feature.properties?.description)
      popupContent += `<small>${feature.properties.description}</small>`;
    if (feature.properties?.notes)
      popupContent += `<small>${feature.properties.notes}</small>`;

    popupContent += `</div>`;

    // --- FIX for popup visibility: Bind a Leaflet popup directly to the layer ---
    layer.bindPopup(popupContent, {
      className: "custom-map-popup", // Add a custom class for potential additional styling
      closeButton: false, // Optional: show/hide close button
      // You can also add specific Leaflet popup options here, e.g., maxWidth, offset
    });

    layer.on("click", () => {
      setSelectedFeature(feature); // Still set selected feature to open the Sheet
      setMapCenter(coords); // Recenter the map on click
    });
  };

  return (
    <div className="relative w-full h-[90vh]">
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution={activeProvider.attribution}
          url={activeProvider.url}
          subdomains={
            activeProvider.name === "Google Maps"
              ? ["mt0", "mt1", "mt2", "mt3"]
              : activeProvider.name === "OpenStreetMap"
              ? ["a", "b", "c"]
              : undefined
          }
        />
        <RecenterMap center={mapCenter} />

        {showGroundwaterWells && (
          <GeoJSON
            key="wells"
            data={groundwaterWells as any}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
          />
        )}

        {showRainfallZones && (
          <GeoJSON
            key="rainfall"
            data={rainfallZones as any}
            onEachFeature={onEachFeature}
            style={styleGeoJson}
          />
        )}
      </MapContainer>

      {/* Controls Sidebar */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg space-y-2 w-[250px]">
        <Label className="font-semibold">خرائط الأساس</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" variant="outline">
              {activeProvider.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[1001]">
            {Object.entries(mapProviders).map(([key, provider]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setActiveProvider(provider)}
              >
                {provider.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="wells"
            checked={showGroundwaterWells}
            onCheckedChange={() => setShowGroundwaterWells((prev) => !prev)}
          />
          <Label htmlFor="wells">عرض آبار المياه</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rainfall"
            checked={showRainfallZones}
            onCheckedChange={() => setShowRainfallZones((prev) => !prev)}
          />
          <Label htmlFor="rainfall">عرض مناطق الأمطار</Label>
        </div>
      </div>

      {/* Feature Info Panel (Sheet component) */}
      {selectedFeature && (
        <Sheet
          open={!!selectedFeature}
          onOpenChange={() => setSelectedFeature(null)}
        >
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                {selectedFeature.properties?.name || "تفاصيل الميزة"}
              </SheetTitle>
              <SheetDescription>
                {selectedFeature.properties?.description ||
                  selectedFeature.properties?.notes ||
                  "لا يوجد وصف متوفر."}
              </SheetDescription>
            </SheetHeader>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>تفاصيل</CardTitle>
                <CardDescription>
                  {selectedFeature.properties?.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {selectedFeature.properties?.level && (
                  <p>
                    <strong>المستوى:</strong> {selectedFeature.properties.level}
                  </p>
                )}
                {selectedFeature.properties?.quality && (
                  <p>
                    <strong>الجودة:</strong>{" "}
                    {selectedFeature.properties.quality}
                  </p>
                )}
                {selectedFeature.properties?.risk && (
                  <p>
                    <strong>المخاطر:</strong> {selectedFeature.properties.risk}
                  </p>
                )}
                {selectedFeature.properties?.last_measured && (
                  <p>
                    <strong>آخر قياس:</strong>{" "}
                    {selectedFeature.properties.last_measured}
                  </p>
                )}
                {selectedFeature.properties?.rainfall_mm && (
                  <p>
                    <strong>معدل الأمطار:</strong>{" "}
                    {selectedFeature.properties.rainfall_mm} ملم
                  </p>
                )}
                {selectedFeature.properties?.month && (
                  <p>
                    <strong>الشهر:</strong> {selectedFeature.properties.month}
                  </p>
                )}
                {selectedFeature.properties?.image && (
                  <img
                    src={selectedFeature.properties.image}
                    alt="صورة"
                    className="rounded-md w-full mt-2"
                  />
                )}
              </CardContent>
            </Card>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default InteractiveMap;
