"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TemplateHero from "@/components/templates/TemplateHero";
import TemplateGrid from "@/components/templates/TemplateGrid";

export default function Templates() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navigation />
      <TemplateHero />
      <TemplateGrid />
      <Footer />
    </div>
  );
} 