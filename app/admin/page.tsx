"use client";
//damn
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import {
  HiPencilAlt,
  HiVideoCamera,
  HiLink,
  HiCheckCircle,
  HiExclamationCircle,
  HiSparkles,
  HiXCircle,
  HiInformationCircle,
  HiArrowRight,
} from "react-icons/hi";

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId =
    searchParams.get("companyId") || process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage({
        type: "error",
        text: "Company ID not found. Please access this app from your Whop dashboard.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/daily-drop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, companyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create drop");
      }

      setMessage({
        type: "success",
        text: "Daily drop published successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        content: "",
        video_url: "",
        link: "",
      });

      // Redirect to today's drop after 2 seconds
      setTimeout(() => {
        router.push("/today");
      }, 2000);
    } catch (error) {
      console.error("Error creating drop:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create drop",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = formData.content.trim().length > 0;

  return (
    <div className="min-h-screen px-4 py-12">
      <Navigation />
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium">
            <HiPencilAlt className="w-4 h-4" />
            <span>Content Creator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Create Daily Drop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share today's exclusive content with your premium members
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-8 glass rounded-2xl p-6 border-2 animate-scale-in ${
              message.type === "success"
                ? "border-green-200 bg-green-50/50"
                : "border-red-200 bg-red-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <HiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <HiExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <p
                className={`font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass rounded-3xl p-8 md:p-10 space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                <HiSparkles className="w-5 h-5 text-purple-600" />
                Title{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your drop a catchy title..."
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg"
              />
            </div>

            {/* Content Field */}
            <div className="space-y-3">
              <label
                htmlFor="content"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                <HiPencilAlt className="w-5 h-5 text-purple-600" />
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your daily drop content here... Share insights, tips, or exclusive knowledge."
                rows={8}
                required
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg resize-none"
              />
              <p className="text-sm text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Video URL Field */}
            <div className="space-y-3">
              <label
                htmlFor="video_url"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                <HiVideoCamera className="w-5 h-5 text-purple-600" />
                Video URL{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                id="video_url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-gray-900">
                    How to get the correct YouTube URL:
                  </p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <HiXCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase mb-1">
                        Wrong Format
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        https://www.youtube.com/watch?v=
                        <span className="bg-yellow-200 px-1">VIDEO_ID</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase mb-1">
                        Correct Format
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        https://www.youtube.com/embed/
                        <span className="bg-green-200 px-1">VIDEO_ID</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t-2 border-blue-200">
                    <HiArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-900 font-bold">
                      Replace "watch?v=" with "embed/" in your YouTube URL
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiInformationCircle className="w-4 h-4 text-gray-600" />
                  <p className="text-xs text-gray-900 font-semibold">
                    For Vimeo: https://player.vimeo.com/video/VIDEO_ID
                  </p>
                </div>
              </div>
            </div>

            {/* Link Field */}
            <div className="space-y-3">
              <label
                htmlFor="link"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                <HiLink className="w-5 h-5 text-purple-600" />
                Resource Link{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/resource"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg"
              />
              <p className="text-xs text-gray-500">
                Add a call-to-action link for members to explore
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/today")}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="group btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Publish Drop
                  <HiCheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-8 p-6 glass rounded-2xl">
          <div className="flex items-start gap-3">
            <HiSparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Publishing Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Keep content concise and valuable</li>
                <li>Add videos to increase engagement</li>
                <li>Include actionable takeaways</li>
                <li>Post consistently to build habit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
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
              <p className="text-lg font-medium text-gray-900">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}
