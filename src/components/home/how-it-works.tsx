import React from "react";
import Link from "next/link";
import { Search, BookmarkCheck, RotateCcw, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Explore Books",
    description:
      "Browse our growing catalog of fiction, science, history, kids, and diverse topics. Check real-time copy availability before borrowing.",
    icon: Search,
    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    step: "02",
    title: "Borrow a Book",
    description:
      "Select your chosen title, review details, and confirm your borrow request with one click. Reserved copies are tracked on your dashboard.",
    icon: BookmarkCheck,
    iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    step: "03",
    title: "Read & Return",
    description:
      "Enjoy reading at your own pace. Once finished, return the book through your borrow manager to make it available for fellow readers.",
    icon: RotateCcw,
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span>Simple & Free</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How Borrowing Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Borrowing from BookNook is designed to be seamless, transparent, and completely free for our reading community.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const StepIcon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col p-8 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 group"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between pb-6">
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center rounded-2xl shadow-xs transition-transform group-hover:scale-105 duration-200",
                      item.iconColor
                    )}
                  >
                    <StepIcon className="size-7" />
                  </div>
                  <span className="text-4xl font-extrabold text-muted-foreground/30 font-mono tracking-tighter">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h4 className="text-xl font-bold text-foreground">
              Ready to begin your reading journey?
            </h4>
            <p className="text-sm text-muted-foreground">
              Discover captivating stories and start borrowing today.
            </p>
          </div>
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 font-semibold shadow-xs shrink-0"
            )}
          >
            <span>Start Exploring Books</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
