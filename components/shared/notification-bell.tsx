"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserNotifications, markNotificationAsRead } from "@/lib/supabase/messages";
import { Bell, Check, MessageSquare, Sparkles } from "lucide-react";

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // 1. Initial Fetch
    async function loadNotifications() {
      const list = await getUserNotifications(userId);
      setNotifications(list);
    }
    loadNotifications();

    // 2. Realtime WebSocket Subscription on notifications table
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkRead(id: string) {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full border hover:bg-accent text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-background p-4 shadow-xl z-50 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-primary font-semibold">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    notif.read ? "bg-background text-muted-foreground" : "bg-primary/5 text-foreground font-medium border-primary/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold capitalize text-primary">
                      {notif.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p>{notif.payload?.message || "Notification update."}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
