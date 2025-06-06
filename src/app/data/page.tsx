// app/data/page.tsx
"use client";

import React from "react";
import Link from "next/link"; // Use Link for navigation between Next.js pages
import {
  Home as HouseIcon,
  Folder,
  Database,
  Layers,
  Settings,
  HelpCircle,
} from "lucide-react"; // Using Lucide icons for consistency
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn Button

// Import your header and footer components (adjust path if needed)
import MainHeader from "@/components/MainHeader";
import { Footer } from "@/components/Footer"; // Assuming Footer is a named export

export default function DataPage() {
  // State for sidebar open/close is not directly needed here as this sidebar is static for this page
  // But we might need it if you plan to make this sidebar collapsible like the map page's
  // For now, we'll keep it simple as it's a fixed-width left pane.

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden"
      style={{
        fontFamily:
          "var(--font-public-sans), var(--font-noto-sans), sans-serif",
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Main Header */}
        {/* The onToggleSidebar prop is not strictly necessary here unless you want a mobile sidebar on this page too */}
        <MainHeader />{" "}
        {/* Assuming MainHeader doesn't *require* the toggle props if not used */}
        {/* Main Content Area: Left Sidebar and Right Data Content */}
        <div className="gap-1 px-6 flex flex-1 flex-col md:flex-row py-5">
          {/* Left Navigation Sidebar */}
          <div className="layout-content-container flex flex-col w-full md:w-80 flex-shrink-0">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#fafbf9] p-4">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#131810] text-base font-medium leading-normal">
                  Alwahdi
                </h1>
                <div className="flex flex-col gap-2">
                  <Link href="/">
                    {" "}
                    {/* Link to your main map page */}
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#ecf1ea] rounded-lg">
                      <HouseIcon className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Dashboard
                      </p>
                    </div>
                  </Link>
                  <Link href="#">
                    {" "}
                    {/* Placeholder for Projects page */}
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#ecf1ea] rounded-lg">
                      <Folder className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Projects
                      </p>
                    </div>
                  </Link>
                  <Link href="/data">
                    {" "}
                    {/* This page, highlight it */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ecf1ea] cursor-pointer">
                      <Database className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Data
                      </p>
                    </div>
                  </Link>
                  <Link href="#">
                    {" "}
                    {/* Placeholder for Models page */}
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#ecf1ea] rounded-lg">
                      <Layers className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Models
                      </p>
                    </div>
                  </Link>
                  <Link href="#">
                    {" "}
                    {/* Placeholder for Settings page */}
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#ecf1ea] rounded-lg">
                      <Settings className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Settings
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#437a28]">
                  <span className="truncate">New Project</span>
                </Button>
                <div className="flex flex-col gap-1">
                  <Link href="#">
                    {" "}
                    {/* Placeholder for Help and docs page */}
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#ecf1ea] rounded-lg">
                      <HelpCircle className="h-6 w-6 text-[#131810]" />
                      <p className="text-[#131810] text-sm font-medium leading-normal">
                        Help and docs
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Data Content Area */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#131810] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Data
              </p>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-[#d9e2d4] px-4 gap-8">
                <Link
                  href="#"
                  className="flex flex-col items-center justify-center border-b-[3px] border-b-[#539932] text-[#131810] pb-[13px] pt-4"
                >
                  <p className="text-[#131810] text-sm font-bold leading-normal tracking-[0.015em]">
                    My Data
                  </p>
                </Link>
                <Link
                  href="#"
                  className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#6a8a5c] pb-[13px] pt-4"
                >
                  <p className="text-[#6a8a5c] text-sm font-bold leading-normal tracking-[0.015em]">
                    Shared with me
                  </p>
                </Link>
              </div>
            </div>
            <h2 className="text-[#131810] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Upload Data
            </h2>
            <div className="flex flex-col p-4">
              <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#d9e2d4] px-6 py-14">
                <div className="flex max-w-[480px] flex-col items-center gap-2">
                  <p className="text-[#131810] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                    Drag and drop files here
                  </p>
                  <p className="text-[#131810] text-sm font-normal leading-normal max-w-[480px] text-center">
                    Or, browse files to upload
                  </p>
                </div>
                <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#ecf1ea] text-[#131810] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d9e2d4]">
                  <span className="truncate">Browse Files</span>
                </Button>
              </div>
            </div>
            <h2 className="text-[#131810] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              My Datasets
            </h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-lg border border-[#d9e2d4] bg-[#fafbf9]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#fafbf9]">
                      <th className="table-column-name px-4 py-3 text-left text-[#131810] text-sm font-medium leading-normal">
                        Name
                      </th>
                      <th className="table-column-type px-4 py-3 text-left text-[#131810] text-sm font-medium leading-normal">
                        Type
                      </th>
                      <th className="table-column-size px-4 py-3 text-left text-[#131810] text-sm font-medium leading-normal">
                        Size
                      </th>
                      <th className="table-column-modified px-4 py-3 text-left text-[#131810] text-sm font-medium leading-normal">
                        Last Modified
                      </th>
                      <th className="table-column-actions px-4 py-3 text-left text-[#131810] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#d9e2d4]">
                      <td className="table-column-name h-[72px] px-4 py-2 text-[#131810] text-sm font-normal leading-normal">
                        Well Data 2024
                      </td>
                      <td className="table-column-type h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        CSV
                      </td>
                      <td className="table-column-size h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        2.5 MB
                      </td>
                      <td className="table-column-modified h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        2024-07-26
                      </td>
                      <td className="table-column-actions h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-bold leading-normal tracking-[0.015em]">
                        View
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d9e2d4]">
                      <td className="table-column-name h-[72px] px-4 py-2 text-[#131810] text-sm font-normal leading-normal">
                        Aquifer Properties
                      </td>
                      <td className="table-column-type h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        Shapefile
                      </td>
                      <td className="table-column-size h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        15 MB
                      </td>
                      <td className="table-column-modified h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        2024-07-20
                      </td>
                      <td className="table-column-actions h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-bold leading-normal tracking-[0.015em]">
                        View
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d9e2d4]">
                      <td className="table-column-name h-[72px] px-4 py-2 text-[#131810] text-sm font-normal leading-normal">
                        Groundwater Levels
                      </td>
                      <td className="table-column-type h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        Raster
                      </td>
                      <td className="table-column-size h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        50 MB
                      </td>
                      <td className="table-column-modified h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-normal leading-normal">
                        2024-07-15
                      </td>
                      <td className="table-column-actions h-[72px] px-4 py-2 text-[#6a8a5c] text-sm font-bold leading-normal tracking-[0.015em]">
                        View
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* The inline style for @container queries should ideally be moved to a CSS file or handled with PostCSS plugins */}
              <style jsx>{`
                @container (max-width: 120px) {
                  .table-column-name {
                    display: none;
                  }
                }
                @container (max-width: 240px) {
                  .table-column-type {
                    display: none;
                  }
                }
                @container (max-width: 360px) {
                  .table-column-size {
                    display: none;
                  }
                }
                @container (max-width: 480px) {
                  .table-column-modified {
                    display: none;
                  }
                }
                @container (max-width: 600px) {
                  .table-column-actions {
                    display: none;
                  }
                }
                @media (min-width: 768px) {
                  /* md breakpoint for larger screens */
                  .table-column-name {
                    width: 400px;
                  }
                  .table-column-type {
                    width: 400px;
                  }
                  .table-column-size {
                    width: 400px;
                  }
                  .table-column-modified {
                    width: 400px;
                  }
                  .table-column-actions {
                    width: 240px;
                  } /* Adjusted to match original width */
                }
              `}</style>
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
