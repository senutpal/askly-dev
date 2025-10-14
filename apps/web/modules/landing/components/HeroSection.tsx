"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowRight, MessageSquare, Globe, Clock } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span>Multilingual AI-Powered Campus Support</span>
          </div>

          {/* Main Heading */}
          <div className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <div className="pb-5">Break Language Barriers</div>
            <span className="text-primary ">Empower Every Student</span>
          </div>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
            ASKLY transforms campus communication with intelligent multilingual
            chatbot support. Answer student queries in Hindi, English, and
            regional languages—24/7, instantly, and accurately.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-blue-600 font-bold">70%</span> Reduced
                Query Load
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-purple-600 font-bold">5+</span> Languages
                Supported
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-green-600 font-bold">24/7</span> Instant
                Answers
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-gray-500">
            Trusted by educational institutions • Enterprise-grade security • No
            credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
