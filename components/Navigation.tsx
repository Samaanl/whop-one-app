"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiCalendar, HiCog } from "react-icons/hi";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/today", label: "Today's Drop", icon: HiCalendar },
    { href: "/admin", label: "Admin", icon: HiCog },
  ];

  return (
    <nav className="fixed top-6 right-6 z-50 animate-scale-in">
      <div className="glass rounded-2xl shadow-xl px-2 py-2 flex gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative px-5 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300 flex items-center gap-2
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-300 ${
                  isActive ? "" : "group-hover:scale-110"
                }`}
              />
              <span className="hidden sm:inline">{item.label}</span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
