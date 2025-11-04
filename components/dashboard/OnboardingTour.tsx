"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Prevent body scroll while onboarding is active
    document.body.style.overflow = "hidden";

    const updateHighlight = () => {
      const isMobile = globalThis.innerWidth < 1024; // lg breakpoint
      let targetElement: Element | null = null;

      if (currentStep === 1) {
        if (isMobile) {
          // Try multiple selectors to find the mobile menu
          targetElement =
            document.querySelector('span[data-onboarding="mobile-menu"]') ||
            document.querySelector(
              String.raw`[aria-label="Open menu"].lg\:hidden`
            ) ||
            document.querySelector(
              String.raw`.lg\:hidden [aria-label="Open menu"]`
            );
        } else {
          targetElement = document.querySelector('a[href="/dashboard/chat"]');
        }
      } else if (currentStep === 2) {
        targetElement = document.querySelector(
          'button[data-onboarding="add-memory"]'
        );
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Longer delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateHighlight, 200);
    window.addEventListener("resize", updateHighlight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateHighlight);
      document.body.style.overflow = "";
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    document.body.style.overflow = "";
    onComplete();
  };

  const getTooltipContent = () => {
    const isMobile = globalThis.innerWidth < 1024; // lg breakpoint

    if (currentStep === 1) {
      return {
        title: "Add memories via Chat",
        description: isMobile
          ? "Open this menu and navigate to Chat to converse naturally. The system will extract and save your memories automatically."
          : "Navigate to Chat to converse naturally. The system will extract and save your memories automatically during the conversation.",
      };
    } else {
      return {
        title: "Or add manually",
        description:
          "Click the + button to add a memory quickly and directly, with your own tags and categories.",
      };
    }
  };

  const content = getTooltipContent();

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const isMobile = globalThis.innerWidth < 1024; // lg breakpoint

    if (isMobile) {
      // On mobile, center tooltip at bottom of screen
      return {
        bottom: "1rem",
        left: "1rem",
        right: "1rem",
        top: "auto",
      };
    }

    // Desktop positioning
    const tooltipTop = highlightPosition.top + highlightPosition.height + 24;
    const tooltipLeft = Math.max(16, highlightPosition.left - 100);

    return {
      top: `${tooltipTop}px`,
      left: `${tooltipLeft}px`,
      bottom: "auto",
      right: "auto",
    };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Dark overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-black/60 transition-opacity z-50 cursor-default"
        onClick={handleComplete}
        aria-label="Close onboarding tour"
      />

      {/* Highlighted area - white spotlight */}
      <div
        className="fixed z-[51] pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          top: `${highlightPosition.top - 8}px`,
          left: `${highlightPosition.left - 8}px`,
          width: `${highlightPosition.width + 16}px`,
          height: `${highlightPosition.height + 16}px`,
        }}
      >
        <div className="w-full h-full rounded-xl bg-white/10 ring-4 ring-orange-500 ring-offset-4 ring-offset-black/60 shadow-2xl" />
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[52] transition-all duration-300 ease-in-out lg:max-w-sm"
        style={tooltipPosition}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-semibold text-sm">
                  {currentStep}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                STEP {currentStep} OF 2
              </span>
            </div>
            <button
              onClick={handleComplete}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Close onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {content.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 sm:mb-5 leading-relaxed">
            {content.description}
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
            {currentStep === 1 && (
              <Button
                onClick={handleNext}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base"
              >
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <>
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1 text-sm sm:text-base"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base"
                >
                  Got it!
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
