"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-pattern" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Ready to Transform Your Campus Communication?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Start Helping Students in Their Language Today
            </h2>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join educational institutions already using ASKLY to provide
              equitable, round-the-clock information access to thousands of
              students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 group"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignInButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <CheckIcon />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon />
                <span>Setup in minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
