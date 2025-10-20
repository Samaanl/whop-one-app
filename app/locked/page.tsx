"use client";

import { useIframeSdk } from "@whop/react";
import { useState } from "react";
import {
  HiLockClosed,
  HiCheckCircle,
  HiSparkles,
  HiClock,
  HiExclamationCircle,
} from "react-icons/hi";

export default function LockedPage() {
  const iframeSdk = useIframeSdk();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Replace with your actual plan ID from environment variables
      const planId = process.env.NEXT_PUBLIC_WHOP_PLAN_ID;

      if (!planId) {
        throw new Error("Plan ID not configured");
      }

      const res = await iframeSdk.inAppPurchase({ planId });

      if (res.status === "ok") {
        // Successful purchase - reload to check access
        window.location.reload();
      } else {
        setError(res.error || "Purchase was not completed");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process upgrade"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: HiSparkles,
      title: "Daily Exclusive Content",
      description: "Get fresh, premium content delivered every single day",
    },
    {
      icon: HiClock,
      title: "Build Your Habit",
      description: "Consistent daily value to keep you growing",
    },
    {
      icon: HiCheckCircle,
      title: "Premium Insights",
      description: "Actionable tips and knowledge from industry experts",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-12 animate-fade-in">
          {/* Lock Icon */}
          <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
            <HiLockClosed className="w-20 h-20 text-purple-600" />
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Members Only Content
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Unlock daily exclusive drops and join a thriving community of
              members getting daily value
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="glass rounded-2xl p-6 space-y-4 card-hover"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="glass rounded-2xl p-6 border-2 border-red-200 animate-scale-in">
              <div className="flex items-center gap-3 text-red-800">
                <HiExclamationCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-8 space-y-4">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="group btn btn-primary text-xl px-16 py-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Upgrade Now
                  <HiSparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                </span>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
