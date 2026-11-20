import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { LatestArrivals } from "@/components/home/latest-arrivals";
import { ExploreCategories } from "@/components/home/explore-categories";
import { HowItWorks } from "@/components/home/how-it-works";

function LatestArrivalsLoading() {
  return (
    <section className="w-full py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="h-20 w-1/3 rounded-xl bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 rounded-2xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Swiper.js Banner Slider */}
      <HeroSlider />

      {/* 2. Latest Arrivals Section */}
      <Suspense fallback={<LatestArrivalsLoading />}>
        <LatestArrivals />
      </Suspense>

      {/* 3. Additional Section A: Explore Categories */}
      <ExploreCategories />

      {/* 4. Additional Section B: How Borrowing Works */}
      <HowItWorks />
    </div>
  );
}
