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
      if (currentStep === 1) {
        // Highlight the Chat button in sidebar
        const chatButton = document.querySelector(
          'a[href="/dashboard/chat"]'
        );
        if (chatButton) {
          const rect = chatButton.getBoundingClientRect();
          setHighlightPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }
      } else if (currentStep === 2) {
        // Highlight the + button
        const addButton = document.querySelector(
          'button[data-onboarding="add-memory"]'
        );
        if (addButton) {
          const rect = addButton.getBoundingClientRect();
          setHighlightPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };

    updateHighlight();
    window.addEventListener("resize", updateHighlight);

    return () => {
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
    if (currentStep === 1) {
      return {
        title: "Add memories via Chat",
        description:
          "Click here to go to Chat and converse naturally. The system will extract and save your memories automatically during the conversation.",
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
        className="fixed z-[52] transition-all duration-300 ease-in-out"
        style={{
          top: `${highlightPosition.top + highlightPosition.height + 24}px`,
          left: `${Math.max(16, highlightPosition.left - 100)}px`,
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm">
                  {currentStep}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                STEP {currentStep} OF 2
              </span>
            </div>
            <button
              onClick={handleComplete}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {content.title}
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {content.description}
          </p>

          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <Button
                onClick={handleNext}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <>
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
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
