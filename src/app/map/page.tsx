"use client"; // This page component also needs to be client-side due to interactivity

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search, Menu, X } from "lucide-react"; // Import Menu and X icons

import { SearchInputWithIcon } from "@/components/custom/search-input-with-icon";
import { CheckboxWithLabel } from "@/components/custom/checkbox-with-label";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Input } from "@/components/ui/input"; // Shadcn Input

import { useMapStore } from "@/store/map-store";
import { cn } from "@/lib/utils"; // Import cn utility for conditional class merging
import MainHeader from "@/components/MainHeader";

// Dynamically import the map component to ensure it's client-side only
const DynamicMap = dynamic(
  () => import("@/components/map/dynamic-map").then((mod) => mod.DynamicMap),
  {
    ssr: false, // Do not render on the server
    loading: () => <p>Loading map...</p>,
  }
);

// Example of a simple debounce function for search
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function Home() {
  const { mapState, setMapState, panTo } = useMapStore();

  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [latInput, setLatInput] = useState<string | null>(null);
  const [lonInput, setLonInput] = useState<string | null>(null);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility

  // Initial map center (example: roughly center of the world)
  const defaultInitialCenter: [number, number] = [20, 0];
  const defaultInitialZoom = 2;

  // Handles checkbox changes
  const handleLayerChange = (layerName: string, isChecked: boolean) => {
    setMapState({
      selectedLayers: isChecked
        ? [...mapState.selectedLayers, layerName]
        : mapState.selectedLayers.filter((name) => name !== layerName),
    });
  };

  // Geocoding search function (for top search bar on map)
  const performGeocodeSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return; // Don't search for too short queries

      // Using OpenStreetMap's Nominatim (for demonstration)
      // IMPORTANT: In a real app, consider rate limits and API keys for production services
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          panTo(parseFloat(lat), parseFloat(lon), 10); // Pan to found location with zoom 10
        } else {
          console.log("No results found for search:", query);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }, 500),
    [panTo]
  ); // Debounce and memoize the function

  // Handle "Go to Location" button click
  const handleGoToLocation = () => {
    if (
      latInput !== null &&
      lonInput !== null &&
      !isNaN(parseFloat(latInput)) &&
      !isNaN(parseFloat(lonInput))
    ) {
      panTo(parseFloat(latInput), parseFloat(lonInput), 10); // Default zoom 10
    } else {
      alert("Please enter valid Latitude and Longitude.");
    }
  };

  // Handle "Predict Groundwater Levels" button click
  const handlePredictGroundwater = async () => {
    setAiPrediction(null);
    setPredictionError(null);
    setIsPredicting(true);

    if (mapState.latitude === null || mapState.longitude === null) {
      setPredictionError(
        "Please select a location on the map or use 'Go to Location' first."
      );
      setIsPredicting(false);
      return;
    }

    try {
      const response = await fetch("/api/gemini/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: mapState.latitude,
          longitude: mapState.longitude,
          selectedLayers: mapState.selectedLayers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setAiPrediction(data.prediction);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      setPredictionError(`Failed to get prediction: ${error.message}`);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden"
      style={{
        fontFamily:
          "var(--font-public-sans), var(--font-noto-sans), sans-serif",
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <MainHeader />
        {/* Mobile Header with Hamburger Menu */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#fafbf9] border-b border-[#d9e2d4]">
          <h1 className="text-[#131810] text-lg font-bold">GIS App</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6 text-[#131810]" />
            ) : (
              <Menu className="h-6 w-6 text-[#131810]" />
            )}
          </Button>
        </div>

        <div className="flex flex-1 flex-col md:flex-row gap-1 md:px-6 md:py-5">
          {/* Left Sidebar */}
          <aside
            className={cn(
              "layout-content-container flex flex-col w-full md:w-80 flex-shrink-0 bg-[#fafbf9] md:rounded-lg md:shadow-md transition-all duration-300 ease-in-out",
              {
                "translate-x-0": isSidebarOpen,
                "-translate-x-full absolute inset-y-0 left-0 z-20":
                  !isSidebarOpen, // Hide off-screen
                "md:relative md:translate-x-0": true, // Always visible on MD+ screens
              }
            )}
          >
            {/* Close button for mobile sidebar */}
            <div className="md:hidden flex justify-end p-4 pb-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-[#131810]" />
              </Button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-0">
              {" "}
              {/* Add padding for mobile overflow */}
              {/* Search location */}
              <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <SearchInputWithIcon
                    icon={<Search className="h-6 w-6" />}
                    placeholder="Search location"
                    value={locationSearchTerm}
                    onChange={(e) => {
                      setLocationSearchTerm(e.target.value);
                      performGeocodeSearch(e.target.value);
                    }}
                  />
                </label>
              </div>
              {/* Data Layers */}
              <h2 className="text-[#131810] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Data Layers
              </h2>
              <div className="px-4">
                <CheckboxWithLabel
                  label="Groundwater Levels"
                  checked={mapState.selectedLayers.includes(
                    "Groundwater Levels"
                  )}
                  onCheckedChange={(checked) =>
                    handleLayerChange("Groundwater Levels", !!checked)
                  }
                />
                <CheckboxWithLabel
                  label="Aquifer Recharge Zones"
                  checked={mapState.selectedLayers.includes(
                    "Aquifer Recharge Zones"
                  )}
                  onCheckedChange={(checked) =>
                    handleLayerChange("Aquifer Recharge Zones", !!checked)
                  }
                />
                <CheckboxWithLabel
                  label="Soil Permeability"
                  checked={mapState.selectedLayers.includes(
                    "Soil Permeability"
                  )}
                  onCheckedChange={(checked) =>
                    handleLayerChange("Soil Permeability", !!checked)
                  }
                />
              </div>
              {/* Analysis Tools */}
              <h2 className="text-[#131810] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Analysis Tools
              </h2>
              <div className="flex px-4 py-3">
                <Button
                  onClick={handlePredictGroundwater}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#437a28]"
                  disabled={isPredicting}
                >
                  <span className="truncate">
                    {isPredicting
                      ? "Predicting..."
                      : "Predict Groundwater Levels"}
                  </span>
                </Button>
              </div>
              {aiPrediction && (
                <div className="px-4 py-3 bg-[#e0f7e0] rounded-lg mt-2">
                  <p className="text-[#131810] text-sm font-medium leading-normal">
                    **AI Prediction:**
                  </p>
                  <p className="text-[#131810] text-sm leading-normal whitespace-pre-wrap">
                    {aiPrediction}
                  </p>
                </div>
              )}
              {predictionError && (
                <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-2">
                  <p className="text-sm">{predictionError}</p>
                </div>
              )}
              {/* Area of Interest */}
              <h2 className="text-[#131810] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Area of Interest
              </h2>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#131810] text-base font-medium leading-normal pb-2">
                    Latitude
                  </p>
                  <Input
                    placeholder="Enter latitude"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#131810] focus:outline-0 focus:ring-0 border border-[#d9e2d4] bg-[#fafbf9] focus:border-[#d9e2d4] h-14 placeholder:text-[#6a8a5c] p-[15px] text-base font-normal leading-normal"
                    value={
                      latInput ??
                      (mapState.latitude !== null
                        ? mapState.latitude.toFixed(6)
                        : "")
                    }
                    onChange={(e) => setLatInput(e.target.value)}
                    type="number"
                    step="any"
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#131810] text-base font-medium leading-normal pb-2">
                    Longitude
                  </p>
                  <Input
                    placeholder="Enter longitude"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#131810] focus:outline-0 focus:ring-0 border border-[#d9e2d4] bg-[#fafbf9] focus:border-[#d9e2d4] h-14 placeholder:text-[#6a8a5c] p-[15px] text-base font-normal leading-normal"
                    value={
                      lonInput ??
                      (mapState.longitude !== null
                        ? mapState.longitude.toFixed(6)
                        : "")
                    }
                    onChange={(e) => setLonInput(e.target.value)}
                    type="number"
                    step="any"
                  />
                </label>
              </div>
              <div className="flex px-4 py-3">
                <Button
                  onClick={handleGoToLocation}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#ecf1ea] text-[#131810] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d9e2d4]"
                >
                  <span className="truncate">Go to Location</span>
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Map Container */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 min-h-[50vh] md:min-h-0 md:h-auto">
            {" "}
            {/* Added min-h for mobile map visibility */}
            <div className="@container flex flex-col h-full flex-1">
              <div className="flex flex-1 flex-col px-0 py-3 md:px-4">
                {" "}
                {/* Adjusted padding */}
                <DynamicMap
                  initialCenter={defaultInitialCenter}
                  initialZoom={defaultInitialZoom}
                  selectedLayers={mapState.selectedLayers}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
