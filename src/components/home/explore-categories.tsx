import React from "react";
import Link from "next/link";
import { BookOpen, Atom, Landmark, Smile, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Fiction",
    description: "Captivating narratives, contemporary novels, fantasy realms, and timeless classics.",
    icon: BookOpen,
    href: "/books?category=Fiction",
    gradient: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/40",
    iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
  {
    title: "Science",
    description: "Astrophysics, biology, emerging technologies, artificial intelligence, and cosmos.",
    icon: Atom,
    href: "/books?category=Science",
    gradient: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/40",
    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    title: "History",
    description: "World wars, ancient empires, transformative civilizations, and memoirs.",
    icon: Landmark,
    href: "/books?category=History",
    gradient: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/40",
    iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    title: "Kids",
    description: "Illustrated adventures, educational storybooks, and joyful bedtime tales.",
    icon: Smile,
    href: "/books?category=Kids",
    gradient: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40",
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Others",
    description: "Art, philosophy, poetry, psychology, personal growth, and diverse perspectives.",
    icon: Layers,
    href: "/books?category=Others",
    gradient: "from-rose-500/10 to-rose-500/5 hover:border-rose-500/40",
    iconColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  },
];

export function ExploreCategories() {
  return (
    <section id="categories" className="w-full py-16 sm:py-20 bg-muted/30 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span>Curated Genres</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Book Categories
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Discover your next favorite read across our five core library collections.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className={cn(
                  "group relative flex flex-col justify-between p-6 rounded-2xl border border-border/80 bg-card hover:shadow-md transition-all duration-300",
                  category.gradient
                )}
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 duration-200",
                      category.iconColor
                    )}
                  >
                    <IconComponent className="size-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Browse {category.title}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
