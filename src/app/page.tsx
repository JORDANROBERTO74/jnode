"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code2,
  Server,
  Palette,
  Globe,
  HardDrive,
  Headphones,
  Layout,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  FileCheck,
  Mail,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND_NAME = "J-NODE Digital Solutions";

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      icon: Code2,
      title: "Software development",
      description:
        "Custom web and mobile applications, APIs and systems that scale with your business.",
    },
    {
      icon: Server,
      title: "Maintenance and support",
      description:
        "Updates, bug fixes and monitoring so your product keeps running at 100%.",
    },
    {
      icon: Headphones,
      title: "Technical consulting",
      description:
        "Consulting on architecture, tech stack and best practices for your project.",
    },
    {
      icon: Globe,
      title: "Domain registration",
      description:
        "Search, registration and renewal of domains with transparency and support.",
    },
    {
      icon: HardDrive,
      title: "Web hosting",
      description:
        "Secure hosting, SSL and professional deployments for sites and applications.",
    },
    {
      icon: Layout,
      title: "Frontend and layout",
      description:
        "Responsive, accessible and optimized interfaces with the latest technologies.",
    },
    {
      icon: Palette,
      title: "UI/UX design",
      description:
        "Interface and user experience design aligned with your brand and goals.",
    },
    {
      icon: PenTool,
      title: "Graphic design and branding",
      description:
        "Visual identity, promotional material and assets for your digital presence.",
    },
  ];

  const whyUs = [
    {
      icon: FileCheck,
      title: "Clear processes",
      description: "Detailed quotes, defined timelines and constant communication.",
    },
    {
      icon: Shield,
      title: "Professionalism",
      description: "Contracts, formal invoicing and ready for payment gateway integration.",
    },
    {
      icon: Zap,
      title: "Current technology",
      description: "Modern stack, best practices and maintainable code.",
    },
  ];

  return (
    <div className="min-h-screen bg-background scroll-smooth pt-16 lg:pt-20">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Image
                src="/images/logo1.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
                aria-hidden
              />
              <span className="text-muted-foreground">
                Software development agency and digital solutions
              </span>
            </div>
            <h1 className="mb-6 animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              We build your
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                {" "}
                digital idea
              </span>
            </h1>
            <p className="mb-8 animate-fade-in-up text-lg text-muted-foreground sm:text-xl md:text-2xl [animation-delay:0.1s]">
              Software development, design, hosting, domains and consulting.
              One agency to take your project to the next level with
              professional processes and clear invoicing.
            </p>
            <div className="flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:justify-center [animation-delay:0.2s]">
              <Button
                size="lg"
                className="h-12 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => {
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Request quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-base transition-all duration-300 hover:scale-105 hover:border-primary/50"
                onClick={() => {
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View services
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No-obligation quote</span>
              </div>
              <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Formal invoicing</span>
              </div>
              <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Post-delivery support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="border-y bg-muted/30 py-24 md:py-32 scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our services
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for your digital presence in one agency:
              development, design, infrastructure and consulting.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item, index) => (
              <Card
                key={index}
                className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <item.icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-3" />
                  </div>
                  <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="what-we-do" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              What we do for you
            </h2>
            <p className="text-lg text-muted-foreground">
              From idea to launch: design, development, deployment and
              maintenance with professional standards.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl">Design and planning</CardTitle>
                <CardDescription className="text-base">
                  We define scope, wireframes and visual design so development
                  is clear and surprise-free.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl">Development and deployment</CardTitle>
                <CardDescription className="text-base">
                  We build your product with clean code, testing and deployment
                  to the hosting or infrastructure of your choice.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl">Maintenance and evolution</CardTitle>
                <CardDescription className="text-base">
                  Support, updates and continuous improvements so your project
                  keeps growing over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section
        id="why-us"
        className="border-y bg-muted/30 py-24 md:py-32 scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why choose us
            </h2>
            <p className="text-lg text-muted-foreground">
              We work with transparency and standards that make invoicing and
              online payments easy when you need them.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {whyUs.map((item, index) => (
              <Card
                key={index}
                className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA - Stripe-ready */}
      <section id="contact" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-background transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Ready to get started?
              </CardTitle>
              <CardDescription className="mx-auto max-w-2xl text-lg">
                Tell us about your project. We&apos;ll send you a clear,
                no-obligation quote. Formal invoicing and, when you&apos;re
                ready, you can pay securely by card or transfer.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-12 w-full text-base sm:w-auto"
                asChild
              >
                <a
                  href="mailto:contacto@jnode.digital?subject=Quote%20from%20website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email contacto@jnode.digital
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full text-base sm:w-auto"
                asChild
              >
                <a
                  href="https://wa.me/1234567890?text=Hi,%20I%20would%20like%20to%20request%20a%20quote"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact via WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center">
                <Image
                  src="/images/logo.png"
                  alt={BRAND_NAME}
                  width={160}
                  height={100}
                  className="h-auto w-[160px] object-fit"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Software development agency and digital solutions.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#services" className="hover:text-foreground">
                    Development
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-foreground">
                    Design and layout
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-foreground">
                    Domains and hosting
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-foreground">
                    Consulting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#why-us" className="hover:text-foreground">
                    Why us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/terminos" className="hover:text-foreground">
                    Terms and conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-foreground">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:contacto@jnode.digital"
                    className="hover:text-foreground"
                  >
                    contacto@jnode.digital
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
