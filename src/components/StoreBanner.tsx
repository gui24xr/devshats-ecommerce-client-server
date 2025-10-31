'use client'
import { useEffect, useState } from "react";
import DataService from "@/lib/DataService";

export default function StoreBanner() {
  const [data, setData] = useState<{
    portrait: any;
    bussinessContent: any;
  } | null>(null);

  useEffect(() => {
    DataService.getStoreDataAndConfigs().then(({ customizationTemplateSettings }) => {
      setData({
        portrait: customizationTemplateSettings.portrait,
        bussinessContent: customizationTemplateSettings.bussinessContent,
      });
    });
  }, []);

  if (!data) {
    return null; // O puedes poner un skeleton/loading si prefieres
  }

  const { portrait, bussinessContent } = data;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-md px-4 py-3 mb-4">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-2xl">{portrait.titleLogoIcon}</span>
        <h1 className="text-xl font-bold text-white">
          {bussinessContent.general.name}
        </h1>
      </div>
      <p className="text-center text-sm text-white/90">
        {bussinessContent.general.tagline}
      </p>
      {bussinessContent.general.subTagline && (
        <p className="text-center text-xs font-medium text-yellow-200 mt-1">
          {bussinessContent.general.subTagline}
        </p>
      )}
    </div>
  );
}
