"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Library,
  Compass,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    backgroundImage: "/hero-1.jpg",
    badge: "Your Online Library Sanctuary",
    badgeIcon: BookOpen,
    title: "Discover Worlds Between the Pages",
    description:
      "Step into BookNook — explore thousands of curated books, borrow stories that inspire, and connect with a passionate community of readers.",
    cta: "Browse Books",
    ctaLink: "/books",
    secondaryCta: "Explore Categories",
    secondaryCtaLink: "#categories",
    gradient:
      "from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 dark:via-background to-background",
    accentColor: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/30",
  },
  {
    id: 2,
    backgroundImage: "/hero-2.jpg",
    badge: "Curiosity & Knowledge",
    badgeIcon: Compass,
    title: "Expand Your Horizons with Science & History",
    description:
      "Uncover timeless truths and breakthrough discoveries. From ancient civilizations to revolutionary technologies, nourish your curiosity with non-fiction.",
    cta: "Browse Books",
    ctaLink: "/books",
    secondaryCta: "Latest Arrivals",
    secondaryCtaLink: "#latest-arrivals",
    gradient:
      "from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-950/30 dark:via-background to-background",
    accentColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/30",
  },
  {
    id: 3,
    backgroundImage: "/hero-3.jpg",
    badge: "Stories for Everyone",
    badgeIcon: Sparkles,
    title: "Inspire Imagination Across All Generations",
    description:
      "Delightful fairy tales, gripping fiction, and youth adventures. Find your next favorite read and share beloved books with readers of all ages.",
    cta: "Browse Books",
    ctaLink: "/books",
    secondaryCta: "How Borrowing Works",
    secondaryCtaLink: "#how-it-works",
    gradient:
      "from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/30 dark:via-background to-background",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/30",
  },
];

function SlideContent({ slide }: { slide: (typeof slides)[0] }) {
  const BadgeIcon = slide.badgeIcon;
  return (
    <div
      className={cn(
        "relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gradient-to-br",
        slide.gradient
      )}
    >
      {/* Hero background image — fills the entire slide area */}
      <Image
        src={slide.backgroundImage}
        alt=""
        fill
        className="object-cover"
      />

      {/* Semi-transparent dark overlay above the image so text and buttons stay readable */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Decorative ambient background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl text-center space-y-6">
        {/* Slide Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs mx-auto">
          <BadgeIcon className={cn("size-3.5", slide.accentColor)} />
          <span className="text-white">{slide.badge}</span>
        </div>

        {/* Slide Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {slide.title}
        </h1>

        {/* Slide Description */}
        <p className="text-base sm:text-lg text-white leading-relaxed max-w-2xl mx-auto">
          {slide.description}
        </p>

        {/* Slide Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href={slide.ctaLink}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 font-semibold px-6"
            )}
          >
            <Library className="size-4" />
            <span>{slide.cta}</span>
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={slide.secondaryCtaLink}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 font-medium bg-background/80 hover:bg-background"
            )}
          >
            <span className="text-white">{slide.secondaryCta}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const emptySubscribe = () => () => { };

export function HeroSlider() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <section className="relative w-full overflow-hidden border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm">
          {!isMounted ? (
            <SlideContent slide={slides[0]} />
          ) : (
            <>
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  el: ".hero-swiper-pagination",
                }}
                navigation={{
                  prevEl: ".hero-swiper-prev",
                  nextEl: ".hero-swiper-next",
                }}
                className="hero-swiper w-full"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <SlideContent slide={slide} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              <button
                type="button"
                className="hero-swiper-prev absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-lg border border-border/80 bg-background/80 backdrop-blur-md text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="hero-swiper-next absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-lg border border-border/80 bg-background/80 backdrop-blur-md text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Custom Pagination Container */}
              <div className="hero-swiper-pagination absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
