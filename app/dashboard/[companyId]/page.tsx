"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiPencilAlt,
  HiVideoCamera,
  HiLink,
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiInformationCircle,
  HiArrowRight,
  HiCalendar,
  HiCollection,
  HiTrash,
  HiEye,
  HiClock,
  HiRefresh,
  HiSave,
} from "react-icons/hi";

interface DailyDrop {
  $id: string;
  title: string;
  content: string;
  video_url?: string;
  link?: string;
  date: string;
  companyId: string;
}

type Tab = "create" | "manage";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const router = useRouter();
  const { companyId } = use(params);

  const [activeTab, setActiveTab] = useState<Tab>("create");

  // Form state
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

  // Recent drops state
  const [recentDrops, setRecentDrops] = useState<DailyDrop[]>([]);
  const [dropsLoading, setDropsLoading] = useState(false);
  const [editingDrop, setEditingDrop] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    totalDrops: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  // Fetch recent drops
  useEffect(() => {
    if (activeTab === "manage") {
      fetchRecentDrops();
    }
  }, [activeTab, companyId]);

  const fetchRecentDrops = async () => {
    setDropsLoading(true);
    try {
      const response = await fetch(
        `/api/daily-drop/list?companyId=${companyId}&limit=10`
      );

      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "API endpoint not found. Please redeploy your app or restart the dev server."
        );
      }

      const data = await response.json();

      if (response.ok) {
        setRecentDrops(data.drops || []);
        setStats(data.stats || { totalDrops: 0, thisMonth: 0, thisWeek: 0 });
      } else {
        throw new Error(data.error || "Failed to fetch drops");
      }
    } catch (error) {
      console.error("Error fetching drops:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to load drops. Please try refreshing or redeploying the app.",
      });
    } finally {
      setDropsLoading(false);
    }
  };

  const handleDelete = async (dropId: string) => {
    if (!confirm("Are you sure you want to delete this drop?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/daily-drop/delete?id=${dropId}&companyId=${companyId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Drop deleted successfully!",
        });
        fetchRecentDrops(); // Refresh list
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete drop",
      });
    }
  };

  const handleEditToggle = (dropId: string, drop?: DailyDrop) => {
    if (editingDrop === dropId) {
      setEditingDrop(null);
      setFormData({ title: "", content: "", video_url: "", link: "" });
    } else {
      setEditingDrop(dropId);
      if (drop) {
        setFormData({
          title: drop.title || "",
          content: drop.content || "",
          video_url: drop.video_url || "",
          link: drop.link || "",
        });
      }
    }
  };

  const handleUpdate = async (dropId: string, date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/daily-drop/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dropId,
          companyId,
          date,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Drop updated successfully!",
        });
        setEditingDrop(null);
        setFormData({ title: "", content: "", video_url: "", link: "" });
        fetchRecentDrops();
      } else {
        throw new Error(data.error || "Failed to update");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update drop",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Switch to manage tab after successful creation
      setTimeout(() => {
        setActiveTab("manage");
        fetchRecentDrops();
      }, 1500);
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

  const convertYouTubeUrl = (url: string): string => {
    if (!url.trim()) return url;

    try {
      // Handle youtube.com/watch?v= format
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1]?.split("&")[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Handle youtu.be/ short format
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Handle youtube.com/shorts/
      if (url.includes("youtube.com/shorts/")) {
        const videoId = url.split("shorts/")[1]?.split("?")[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // If already in embed format or other video service, return as is
      return url;
    } catch (error) {
      // If parsing fails, return original URL
      return url;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Auto-convert YouTube URLs to embed format
    if (name === "video_url") {
      const convertedUrl = convertYouTubeUrl(value);
      setFormData({
        ...formData,
        [name]: convertedUrl,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const isFormValid = formData.content.trim().length > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Top Nav */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push(`/today?companyId=${companyId}`)}
          className="btn btn-ghost inline-flex items-center gap-2"
        >
          <HiEye className="w-5 h-5" />
          View Member View
        </button>
        <button
          onClick={() => fetchRecentDrops()}
          className="btn btn-ghost inline-flex items-center gap-2"
        >
          <HiRefresh className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium">
            <HiPencilAlt className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Daily Drop Manager
          </h1>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 glass rounded-2xl p-4 border-2 animate-scale-in ${
              message.type === "success"
                ? "border-green-200 bg-green-50/50"
                : "border-red-200 bg-red-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <HiExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 glass rounded-2xl p-2 inline-flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === "create"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HiPencilAlt className="w-5 h-5" />
            <span>Create New</span>
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === "manage"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HiCollection className="w-5 h-5" />
            <span>Manage Drops</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "create" && (
          <div className="space-y-6">
            {/* Create Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <HiPencilAlt className="w-4 h-4 text-purple-600" />
                    Title{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={2500}
                    placeholder="Give your drop a catchy title..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {formData.title.length} / 2,500 characters
                    </span>
                    {formData.title.length > 2000 && (
                      <span className="text-orange-600 font-medium">
                        Approaching limit
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <HiPencilAlt className="w-4 h-4 text-purple-600" />
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    maxLength={100000}
                    placeholder="Write your daily drop content here..."
                    rows={8}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {formData.content.length.toLocaleString()} / 100,000
                      characters
                    </span>
                    {formData.content.length > 90000 && (
                      <span className="text-orange-600 font-medium">
                        Approaching limit
                      </span>
                    )}
                  </div>
                </div>

                {/* Video URL Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="video_url"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <HiVideoCamera className="w-4 h-4 text-purple-600" />
                    Video URL{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    maxLength={5000}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {formData.video_url.length} / 5,000 characters
                    </span>
                    {formData.video_url.length > 4500 && (
                      <span className="text-orange-600 font-medium">
                        Approaching limit
                      </span>
                    )}
                  </div>
                </div>

                {/* Link Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="link"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <HiLink className="w-4 h-4 text-purple-600" />
                    Resource Link{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    maxLength={5000}
                    placeholder="https://example.com/resource"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                  <div className="text-xs text-gray-500">
                    {formData.link.length} / 5,000 characters
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Publish Drop
                      <HiCheckCircle className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Database Schema Info Card */}
            <div className="glass rounded-2xl p-6 border-2 border-blue-200 bg-blue-50/30">
              <div className="flex items-start gap-3 mb-4">
                <HiInformationCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Database Field Limits
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Your content is stored in Appwrite with these restrictions:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      Title
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Max: 2,500 characters</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      Content
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Max: 100,000 characters
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      Video URL
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Max: 5,000 characters</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      Link
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Max: 5,000 characters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="space-y-6">
            {dropsLoading ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading drops...</p>
              </div>
            ) : recentDrops.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <HiCollection className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Drops Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start creating daily drops for your members
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="btn btn-primary"
                >
                  Create First Drop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDrops.map((drop) => (
                  <div
                    key={drop.$id}
                    className="glass rounded-2xl p-6 space-y-4 card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <HiCalendar className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-gray-900">
                            {formatDate(drop.date)}
                          </span>
                        </div>
                        {editingDrop === drop.$id ? (
                          <div className="space-y-4">
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="Title (optional)"
                              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                            />
                            <textarea
                              name="content"
                              value={formData.content}
                              onChange={handleChange}
                              rows={6}
                              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none resize-none"
                            />
                            <input
                              type="url"
                              name="video_url"
                              value={formData.video_url}
                              onChange={handleChange}
                              placeholder="Video URL (optional)"
                              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                            />
                            <input
                              type="url"
                              name="link"
                              value={formData.link}
                              onChange={handleChange}
                              placeholder="Resource link (optional)"
                              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleUpdate(drop.$id, drop.date)
                                }
                                disabled={loading}
                                className="btn btn-primary text-sm"
                              >
                                <HiSave className="w-4 h-4" />
                                Save Changes
                              </button>
                              <button
                                onClick={() => handleEditToggle(drop.$id)}
                                className="btn btn-ghost text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {drop.title && (
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {drop.title}
                              </h3>
                            )}
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {drop.content.substring(0, 200)}
                              {drop.content.length > 200 && "..."}
                            </p>
                            {(drop.video_url || drop.link) && (
                              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                {drop.video_url && (
                                  <span className="flex items-center gap-1">
                                    <HiVideoCamera className="w-4 h-4" />
                                    Video
                                  </span>
                                )}
                                {drop.link && (
                                  <span className="flex items-center gap-1">
                                    <HiLink className="w-4 h-4" />
                                    Link
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {editingDrop !== drop.$id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditToggle(drop.$id, drop)}
                            className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
                            title="Edit"
                          >
                            <HiPencilAlt className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(drop.$id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
