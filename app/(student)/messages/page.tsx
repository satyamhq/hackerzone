"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import {
  getUserMessageThreads,
  getThreadMessages,
  sendMessage,
} from "@/lib/supabase/messages";
import { getEmployerCompany } from "@/lib/supabase/employers";
import { MessageSquare, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);

  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const [newMessageBody, setNewMessageBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const emp = await getEmployerCompany(user.id);
        if (emp?.company_id) {
          setCompanyId(emp.company_id);
        }

        const userThreads = await getUserMessageThreads(user.id);
        setThreads(userThreads);
        if (userThreads.length > 0) {
          setActiveThreadId(userThreads[0].id);
        }
      }
      setIsLoading(false);
    }
    init();
  }, []);

  // Fetch thread messages and setup Realtime WebSocket subscription
  useEffect(() => {
    if (!activeThreadId) return;

    const supabase = createClient();

    async function loadMessages() {
      const msgs = await getThreadMessages(activeThreadId!);
      setMessages(msgs);
    }
    loadMessages();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat_thread_${activeThreadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${activeThreadId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          // Fetch sender profile details for realtime message
          const { data: senderProf } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, role")
            .eq("id", newMsg.sender_id)
            .single();

          const incoming = {
            ...newMsg,
            sender: senderProf,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeThreadId]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !activeThreadId || !newMessageBody.trim()) return;

    setIsSending(true);
    setErrorMessage(null);

    const activeThread = threads.find((t) => t.id === activeThreadId);
    const recipientId = activeThread?.participant_ids?.find((id: string) => id !== userId);

    if (!recipientId) {
      setErrorMessage("Recipient not found for this conversation.");
      setIsSending(false);
      return;
    }

    try {
      await sendMessage(
        activeThreadId,
        userId,
        recipientId,
        newMessageBody.trim(),
        companyId
      );
      setNewMessageBody("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <p className="text-slate-500 font-semibold">Loading inbox...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Direct Messages</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Real-time recruiter & candidate communications powered by Supabase WebSockets.
            </p>
          </div>
          <Badge variant="brand" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Live Sync
          </Badge>
        </div>

        {threads.length === 0 ? (
          <Card className="p-16 text-center space-y-4">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">No active conversations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Direct threads initiated during job applications or recruiter outreach will appear here.
            </p>
          </Card>
        ) : (
          <Card className="grid grid-cols-1 md:grid-cols-12 p-0 overflow-hidden min-h-[580px]">
            {/* Thread List Sidebar */}
            <div className="md:col-span-4 border-r border-slate-100 p-4 space-y-2 bg-slate-50/50">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-3 py-2">
                Conversations ({threads.length})
              </div>
              {threads.map((thread) => {
                const isActive = activeThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 border ${
                      isActive
                        ? "bg-white border-blue-200 text-slate-900 font-bold shadow-sm"
                        : "border-transparent hover:bg-slate-100/80 text-slate-600"
                    }`}
                  >
                    <div className="text-xs truncate font-bold">{thread.subject || "Direct Message Thread"}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(thread.updated_at).toLocaleDateString()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Thread Chat Box */}
            <div className="md:col-span-8 flex flex-col p-6 bg-white">
              {errorMessage && (
                <div className="p-3 mb-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 min-h-[380px]">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-16">No messages in this conversation yet.</p>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === userId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMine
                              ? "bg-slate-900 text-white rounded-br-none"
                              : "bg-white border border-slate-200/80 text-slate-900 rounded-bl-none"
                          }`}
                        >
                          <div className={`text-[10px] font-extrabold mb-1 ${isMine ? "text-blue-300" : "text-blue-600"}`}>
                            {isMine ? "You" : msg.sender?.full_name || "User"}
                          </div>
                          <div>{msg.body}</div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <Button
                  type="submit"
                  isLoading={isSending}
                  disabled={!newMessageBody.trim()}
                  variant="brand"
                  size="sm"
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </Button>
              </form>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
