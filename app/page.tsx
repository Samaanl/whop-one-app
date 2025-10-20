"use client";

import { useRouter } from "next/navigation";
import {
  HiSparkles,
  HiLockClosed,
  HiCalendar,
  HiArrowRight,
} from "react-icons/hi";

export default function LandingPage() {
  const router = useRouter();

  const handleCheckDrop = () => {
    router.push("/today");
  };

  const features = [
    {
      icon: HiCalendar,
      title: "Daily Content",
      description: "Fresh drops delivered every single day",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiLockClosed,
      title: "Members Only",
      description: "Exclusive access for premium members",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: HiSparkles,
      title: "Premium Quality",
      description: "Curated content worth your time",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center space-y-16 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium">
                <HiSparkles className="w-4 h-4" />
                <span>Premium Content Platform</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="gradient-text">The Daily Drop</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Unlock exclusive daily content crafted specifically for our
                premium members
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={handleCheckDrop}
                className="group btn btn-primary inline-flex items-center gap-2 text-lg"
              >
                <span>View Today's Drop</span>
                <HiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-hover glass rounded-3xl p-10 text-center space-y-6 border-2 border-gray-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center">
                    <div
                      className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-700 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Social Proof */}
          <div className="pt-12 space-y-4">
            <div className="flex justify-center items-center gap-3 text-gray-900">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 border-3 border-white shadow-lg"
                  />
                ))}
              </div>
              <span className="text-base font-bold">
                Join{" "}
                <span className="text-purple-600 font-extrabold text-lg">
                  1,000+
                </span>{" "}
                members
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
