"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Sparkles, Clock, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserNotificationEntity } from "@/lib/supabase/types";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<UserNotificationEntity[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: "PUT" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        title="Notifications"
      >
        <Bell className="h-4 w-4 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" size="sm">
                  {unreadCount} NEW
                </Badge>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 cyber-scrollbar pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    !n.isRead
                      ? "bg-cyan-500/10 border-cyan-500/30 text-foreground"
                      : "bg-white/[0.02] border-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-xs text-foreground leading-snug">{n.title}</h5>
                    <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/90 mt-1 leading-relaxed">{n.message}</p>
                  {n.linkUrl && (
                    <Link
                      href={n.linkUrl}
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] font-mono text-cyan-400 hover:underline block mt-1.5"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
