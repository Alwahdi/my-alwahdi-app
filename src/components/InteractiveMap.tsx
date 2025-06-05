"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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

// Define map providers
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
    url: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "Map data &copy; Google",
  },
};

// RecenterMap component
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
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
  const mapRef = useRef<any>(null);

  // Style for polygons
  const styleGeoJson = {
    color: "blue",
    weight: 2,
    fillOpacity: 0.1,
  };

  // Point to Layer for wells
  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    const quality = feature.properties.quality || "good";
    const iconUrl =
      quality === "poor" ? "/well-icon-red.png" : "/well-icon.png";
    const icon = L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    return L.marker(latlng, { icon });
  };

  // OnEachFeature handler
  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on("click", () => {
      setSelectedFeature(feature);
      const coords =
        feature.geometry.type === "Point"
          ? [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
          : [
              feature.geometry.coordinates[0][0][1],
              feature.geometry.coordinates[0][0][0],
            ];
      setMapCenter(coords as [number, number]);
    });
  };

  useEffect(() => {
    // Any side effects or map-related logic
  }, []);

  return (
    <div className="relative w-full h-[90vh]">
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => {
          if (mapRef.current == null && typeof window !== "undefined") {
            // Access the map instance via leaflet's global L.Map
            // or use a ref callback on MapContainer if needed
            // For now, do nothing or set up ref elsewhere if needed
          }
        }}
      >
        <TileLayer
          attribution={activeProvider.attribution}
          url={activeProvider.url}
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
          <DropdownMenuContent>
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

      {/* Feature Info Panel */}
      {selectedFeature && (
        <Sheet
          open={!!selectedFeature}
          onOpenChange={() => setSelectedFeature(null)}
        >
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{selectedFeature.properties?.name}</SheetTitle>
              <SheetDescription>
                {selectedFeature.properties?.description ||
                  selectedFeature.properties?.notes}
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
