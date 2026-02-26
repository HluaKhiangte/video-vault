import { useState } from "react";
import BottomNav, { Tab } from "@/components/BottomNav";
import HomeTab from "@/components/tabs/HomeTab";
import StatusSaverTab from "@/components/tabs/StatusSaverTab";
import DownloadsTab from "@/components/tabs/DownloadsTab";

export type DownloadState = "idle" | "fetching" | "downloading" | "done" | "error";

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: string;
  resolution: string;
  fileSize: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(195 100% 50%), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[15%] right-[-10%] w-[250px] h-[250px] rounded-full opacity-8"
          style={{ background: "radial-gradient(ellipse, hsl(145 60% 45%), transparent 70%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-lg mx-auto px-4 pt-6 pb-24">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "status" && <StatusSaverTab />}
        {activeTab === "downloads" && <DownloadsTab />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav active={activeTab} onChange={setActiveTab} downloadCount={5} />
    </div>
  );
};

export default Index;
