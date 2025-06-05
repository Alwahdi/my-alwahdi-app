// app/dashboard/page.tsx

import AiChat from "@/components/AiChat";
import MainHeader from "@/components/MainHeader";
import Overview from "@/components/OverView";

export default function Dashboard() {
  return (
    // This div corresponds to the outermost container in your HTML, setting the background and overall layout properties.
    <div className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden">
      {/* This div corresponds to the 'layout-container' in your HTML, responsible for the main vertical flow. */}
      <div className="layout-container flex h-full grow flex-col">
        <MainHeader />
        {/* This 'main' tag now applies the padding and centering for the content area, matching your HTML. */}
        <main className="px-40 flex flex-1 justify-center py-5">
          {/* This div acts as the 'layout-content-container', limiting the width of the main content to 960px. */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <Overview />
            <AiChat />
          </div>
        </main>
      </div>
    </div>
  );
}
