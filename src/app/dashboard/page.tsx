import MainHeader from "@/components/MainHeader";
import DashboardClient from "./DashboardClient";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <MainHeader />
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <DashboardClient />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
