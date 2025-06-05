// components/InteractiveMap.tsx
'use client'; // This must be the very first line

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Fix for default Leaflet icon issues with Webpack/Vite
delete (L.Icon.Default.prototype as any)._get  IconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});


// --- DEMO DATA FOR IBb, YEMEN ---
// Coordinates for Ibb city center (approximate)
const ibbCoordinates: [number, number] = [13.9626, 44.1804]; // Lat, Lng

// Demo Groundwater Well Data (GeoJSON Points) for Ibb region
const groundwaterWells: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "well-001",
        name: "Al-Sahul Well",
        level: "15.2m (Low)",
        quality: "Good",
        last_measured: "2025-05-30",
        notes: "Slightly below average level for this season.",
        risk: "Moderate",
        image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Well+001" // Placeholder image
      },
      geometry: {
        type: "Point",
        coordinates: [44.1850, 13.9700] // Lng, Lat
      }
    },
    {
      type: "Feature",
      properties: {
        id: "well-002",
        name: "Jiblah Aquifer Point",
        level: "20.1m (Stable)",
        quality: "Excellent",
        last_measured: "2025-06-01",
        notes: "Consistent levels, good for agriculture.",
        risk: "Low",
        image: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Well+002"
      },
      geometry: {
        type: "Point",
        coordinates: [44.1700, 13.9500]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "well-003",
        name: "Yarim Well (North)",
        level: "10.5m (Critical)",
        quality: "Fair",
        last_measured: "2025-05-28",
        notes: "Significantly low due to recent drought. Requires intervention.",
        risk: "High",
        image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Well+003"
      },
      geometry: {
        type: "Point",
        coordinates: [44.2000, 13.9850]
      }
    },
     {
      type: "Feature",
      properties: {
        id: "well-004",
        name: "Dhamar Border Well",
        level: "18.0m (Stable)",
        quality: "Good",
        last_measured: "2025-05-29",
        notes: "Monitored for cross-regional water management.",
        risk: "Low",
        image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Well+004"
      },
      geometry: {
        type: "Point",
        coordinates: [44.2150, 14.0050]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "well-005",
        name: "Rural Ibb Source",
        level: "16.5m (Stable)",
        quality: "Good",
        last_measured: "2025-05-27",
        notes: "Primary source for local community.",
        risk: "Low",
        image: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Well+005"
      },
      geometry: {
        type: "Point",
        coordinates: [44.1600, 13.9300]
      }
    }
  ]
};

// Demo Rainfall Data (GeoJSON Polygons/Circles for illustrative purposes)
const rainfallZones: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "zone-001",
        name: "High Rainfall Zone (West Ibb)",
        rainfall_mm: 120,
        month: "May",
        description: "Area experiencing significant rainfall during May.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [44.1500, 13.9800],
            [44.1700, 13.9900],
            [44.1800, 13.9700],
            [44.1600, 13.9600],
            [44.1500, 13.9800]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-002",
        name: "Moderate Rainfall Zone (East Ibb)",
        rainfall_mm: 70,
        month: "May",
        description: "Moderate rainfall, aiding local agriculture.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [44.1900, 13.9500],
            [44.2100, 13.9600],
            [44.2200, 13.9400],
            [44.2000, 13.9300],
            [44.1900, 13.9500]
          ]
        ]
      }
    }
  ]
};

// --- Map Provider Options ---
const mapProviders = {
  OpenStreetMap: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  Esri_WorldImagery: {
    name: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  Esri_WorldStreetMap: {
    name: "Esri World Street Map",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_StreetMap/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, HERE, TomTom, Intermap, increment P Corp, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, OpenStreetMap contributors, and the GIS User Community'
  },
  Google_Roadmap: {
    name: "Google Maps (Roadmap)",
    // Note: Google Maps tiles often require an API key and might need a specific plugin like `leaflet-google-mutant`
    // For simplicity, this URL is a placeholder and might not work without proper setup.
    // A real implementation would involve a more complex integration.
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    requiresApiKey: true,
  },
  // Add more providers here as needed
};

// Custom Icon for groundwater wells (to differentiate from default Leaflet marker)
const wellIcon = new L.Icon({
  iconUrl: '/well-icon.png', // You'll need to create this image in your public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A component to re-center the map if needed (e.g., when changing active features)
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const InteractiveMap: React.FC = () => {
  const [activeProvider, setActiveProvider] = useState(mapProviders.OpenStreetMap);
  const [showGroundwaterWells, setShowGroundwaterWells] = useState(true);
  const [showRainfallZones, setShowRainfallZones] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSON.Feature | null>(null);
  const mapRef = useRef<L.Map | null>(null); // For direct map instance access
  const [mapCenter, setMapCenter] = useState<[number, number]>(ibbCoordinates);

  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    layer.on({
      click: () => {
        setSelectedFeature(feature);
        if (feature.geometry.type === 'Point') {
          setMapCenter([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]); // GeoJSON is LngLat, Leaflet is LatLng
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          // For polygons, fit bounds
          const bounds = (layer as L.Polygon).getBounds();
          mapRef.current?.fitBounds(bounds);
        }
      },
    });
  }, []);

  const pointToLayer = useCallback((feature: GeoJSON.Feature, latlng: L.LatLng) => {
    // Customize marker icon for points (e.g., groundwater wells)
    if (feature.properties?.risk === 'High') {
      return L.marker(latlng, { icon: new L.Icon({ ...wellIcon.options, iconUrl: '/well-icon-red.png' }) });
    }
    return L.marker(latlng, { icon: wellIcon });
  }, []);

  const styleGeoJson = useCallback((feature: GeoJSON.Feature) => {
    if (feature.geometry.type === 'Polygon') {
      // Style for rainfall zones
      const rainfall = feature.properties?.rainfall_mm || 0;
      let fillColor = '#00FF00'; // Default green
      if (rainfall > 100) fillColor = '#0000FF'; // Blue for high rainfall
      else if (rainfall < 50) fillColor = '#FFFF00'; // Yellow for low rainfall

      return {
        fillColor: fillColor,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5,
      };
    }
    return {};
  }, []);

  useEffect(() => {
    // This effect runs only once to set up the map ref for direct Leaflet API access
    if (mapRef.current) {
      console.log('Leaflet map instance available:', mapRef.current);
    }
  }, []);

  return (
    <>
      <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Interactive Map
      </h2>
      <div className="flex flex-col md:flex-row gap-4 px-4 py-3">
        {/* Map Controls */}
        <Card className="p-4 flex flex-col gap-4 max-w-sm md:max-w-[250px] w-full">
          <CardTitle className="text-lg">Map Controls</CardTitle>
          <CardContent className="p-0 flex flex-col gap-3">
            {/* Provider Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="map-provider-select" className="text-sm font-medium">Map Provider</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" id="map-provider-select">
                    {activeProvider.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.values(mapProviders).map((provider) => (
                    <DropdownMenuItem
                      key={provider.name}
                      onClick={() => {
                        if (provider.requiresApiKey) {
                          alert(`Warning: '${provider.name}' requires an API Key for full functionality. Please check your console for details.`);
                          // In a real app, you'd manage API keys securely
                        }
                        setActiveProvider(provider);
                      }}
                    >
                      {provider.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Layers</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="groundwater-wells"
                  checked={showGroundwaterWells}
                  onCheckedChange={(checked: boolean) => setShowGroundwaterWells(checked)}
                />
                <label
                  htmlFor="groundwater-wells"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Groundwater Wells
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rainfall-zones"
                  checked={showRainfallZones}
                  onCheckedChange={(checked: boolean) => setShowRainfallZones(checked)}
                />
                <label
                  htmlFor="rainfall-zones"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Rainfall Zones
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <div className="flex-1 min-h-[500px] w-full border border-[#d9e1d6] rounded-xl overflow-hidden">
          <MapContainer
            center={ibbCoordinates} // Initial center on Ibb
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
          >
            <RecenterMap center={mapCenter} /> {/* Component to handle map re-centering */}
            <TileLayer
              attribution={activeProvider.attribution}
              url={activeProvider.url}
            />

            {showGroundwaterWells && (
              <GeoJSON
                data={groundwaterWells as any} // Cast to any to satisfy type for GeoJSONFeatureCollection
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
              />
            )}

            {showRainfallZones && (
              <GeoJSON
                data={rainfallZones as any} // Cast to any
                onEachFeature={onEachFeature}
                style={styleGeoJson}
              />
            )}
          </MapContainer>
        </div>

        {/* Feature Details Panel (Sheet) */}
        {selectedFeature && (
            <Sheet open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-lg">Details for {selectedFeature.properties?.name || 'Feature'}</SheetTitle>
                  <SheetDescription>
                    Information about the selected groundwater well or rainfall zone.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {Object.entries(selectedFeature.properties || {}).map(([key, value]) => (
                    <p key={key} className="text-sm mb-1">
                      <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {value as string}
                    </p>
                  ))}
                  {selectedFeature.properties?.image && (
                    <img src={selectedFeature.properties.image} alt={selectedFeature.properties.name} className="mt-4 max-w-full h-auto rounded-md" />
                  )}
                </div>
              </SheetContent>
            </Sheet>
        )}
      </div>
    </>
  );
};

export default InteractiveMap;