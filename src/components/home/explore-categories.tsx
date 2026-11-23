import React from "react";
import Link from "next/link";
import { BookOpen, Atom, Landmark, Smile, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryStyle } from "@/components/books/category-styles";

const categories = [
  {
    title: "Fiction",
    description: "Captivating narratives, contemporary novels, fantasy realms, and timeless classics.",
    icon: BookOpen,
    href: "/books?category=Fiction",
  },
  {
    title: "Science",
    description: "Astrophysics, biology, emerging technologies, artificial intelligence, and cosmos.",
    icon: Atom,
    href: "/books?category=Science",
  },
  {
    title: "History",
    description: "World wars, ancient empires, transformative civilizations, and memoirs.",
    icon: Landmark,
    href: "/books?category=History",
  },
  {
    title: "Kids",
    description: "Illustrated adventures, educational storybooks, and joyful bedtime tales.",
    icon: Smile,
    href: "/books?category=Kids",
  },
  {
    title: "Others",
    description: "Art, philosophy, poetry, psychology, personal growth, and diverse perspectives.",
    icon: Layers,
    href: "/books?category=Others",
  },
];

export function ExploreCategories() {
  return (
    <section id="categories" className="w-full py-16 sm:py-20 bg-muted/30 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
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
            const style = getCategoryStyle(category.title);
            return (
              <Link
                key={category.title}
                href={category.href}
                className={cn(
                  "group relative flex flex-col justify-between p-6 rounded-2xl border border-border/80 shadow-sm transition-all duration-300 hover:-translate-y-1",
                  style.card,
                  "hover:shadow-lg",
                )}
              >
                <div className="space-y-4">
                  <div className={cn("flex size-12 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 duration-200", style.icon)}>
                    <IconComponent className="size-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className={cn("font-bold text-lg text-foreground transition-colors", style.titleHover)}>
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className={cn("pt-6 flex items-center gap-1 text-xs font-semibold", style.accent, "group-hover:translate-x-1 transition-transform")}>
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
