"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const BRAND_NAME = "J-NODE";
const BRAND_SUBTITLE = "Digital Solutions";

const navigationItems = [
  { name: "Services", href: "#services" },
  { name: "What we do", href: "#what-we-do" },
  { name: "Why us", href: "#why-us" },
  { name: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Go to home"
          >
            <Image
              src="/images/logo.png"
              alt={`${BRAND_NAME} ${BRAND_SUBTITLE}`}
              width={180}
              height={44}
              className="h-9 w-auto object-contain lg:h-10"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button
              onClick={() => handleNavClick("#contact")}
              variant="ghost"
              className="text-sm"
            >
              Request quote
            </Button>
            <Button
              onClick={() => handleNavClick("#contact")}
              size="sm"
              className="gap-2"
            >
              Contact
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center border-b pb-4">
                  <Image
                    src="/images/logo1.png"
                    alt={`${BRAND_NAME} ${BRAND_SUBTITLE}`}
                    width={180}
                    height={44}
                    className="h-9 w-auto object-contain"
                  />
                </div>

                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className="rounded-md px-3 py-2 text-left text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>

                <div className="mt-4 flex flex-col gap-3 border-t pt-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleNavClick("#contact")}
                    className="w-full"
                  >
                    Request quote
                  </Button>
                  <Button
                    onClick={() => {
                      handleNavClick("#contact");
                    }}
                    className="w-full gap-2"
                  >
                    Contact
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
