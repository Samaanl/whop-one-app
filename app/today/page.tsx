"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiCalendar,
  HiExternalLink,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiInboxIn,
} from "react-icons/hi";

interface DailyDrop {
  title: string;
  content: string;
  video_url?: string;
  link?: string;
  date: string;
}

function TodayPageContent() {
  const searchParams = useSearchParams();
  const companyId =
    searchParams.get("companyId") || process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  const [drop, setDrop] = useState<DailyDrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      fetchTodaysDrop();
    } else {
      setError(
        "Company ID not found. Please access this app from your Whop dashboard."
      );
      setLoading(false);
    }
  }, [companyId]);

  const fetchTodaysDrop = async () => {
    if (!companyId) {
      return;
    }

    try {
      const response = await fetch(`/api/daily-drop?companyId=${companyId}`);
      const data = await response.json();

      if (response.ok && data.drop) {
        setDrop(data.drop);
        setError(null);
      } else if (response.status === 401 || response.status === 403) {
        // Show detailed error for debugging
        const errorMsg =
          data.error || "You need to be a member to view this content.";
        const debugInfo = data.debug
          ? `\n\nDebug: ${JSON.stringify(data.debug)}`
          : "";
        setError(errorMsg + debugInfo);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching drop:", error);
      setError("Failed to load today's drop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Loading today's drop
            </p>
            <p className="text-sm text-gray-500">Just a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-scale-in">
          <div className="inline-flex p-6 rounded-full bg-red-100">
            <HiExclamationCircle className="w-16 h-16 text-red-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Access Issue
            </h1>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {error}
            </p>
            <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg text-left">
              <p className="font-bold mb-2">Troubleshooting:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Make sure you're accessing from your Whop dashboard</li>
                <li>Check that the app has the correct permissions</li>
                <li>Company ID: {companyId || "Not found"}</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-scale-in">
          <div className="inline-flex p-6 rounded-full bg-purple-100">
            <HiInboxIn className="w-16 h-16 text-purple-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              No Drop Today
            </h1>
            <p className="text-gray-600 leading-relaxed">
              The creator hasn't posted today's drop yet. Check back soon!
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm text-gray-600">
            <HiClock className="w-4 h-4" />
            <span>Check back later</span>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-10 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium">
              <HiCheckCircle className="w-4 h-4" />
              <span>Today's Drop</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-900">
              <HiCalendar className="w-5 h-5" />
              <span className="text-base font-bold">{formattedDate}</span>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="glass rounded-3xl p-8 md:p-12 space-y-8 card-hover">
            {/* Title */}
            {drop.title && (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {drop.title}
              </h1>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 whitespace-pre-wrap">
                {drop.content}
              </p>
            </div>

            {/* Video Embed */}
            {drop.video_url && (
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                <iframe
                  src={drop.video_url}
                  title="Daily drop video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Link */}
            {drop.link && (
              <div className="pt-4">
                <a
                  href={drop.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 btn btn-primary w-full sm:w-auto justify-center"
                >
                  <span>View Resource</span>
                  <HiExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-6">
            <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 shadow-lg">
              <div className="flex items-center gap-2">
                <HiClock className="w-5 h-5 text-purple-700" />
                <span className="text-lg font-bold text-purple-900">
                  Next Drop Available Soon!
                </span>
              </div>
              <p className="text-sm font-semibold text-purple-800">
                Come back tomorrow at{" "}
                <span className="text-purple-900 font-bold">
                  midnight (12:00 AM)
                </span>{" "}
                for your next exclusive drop
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Loading today's drop
              </p>
              <p className="text-sm text-gray-500">Just a moment...</p>
            </div>
          </div>
        </div>
      }
    >
      <TodayPageContent />
    </Suspense>
  );
}
