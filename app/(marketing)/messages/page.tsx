"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import {
  getUserMessageThreads,
  getThreadMessages,
  sendMessage,
} from "@/lib/supabase/messages";
import { getEmployerCompany } from "@/lib/supabase/employers";
import { MessageSquare, Send, User } from "lucide-react";

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
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading inbox...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Realtime Messages</h1>

        {threads.length === 0 ? (
          <div className="p-12 border rounded-xl bg-muted/20 text-center space-y-2">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm">No active message threads</h3>
            <p className="text-xs text-muted-foreground">
              Conversations initiated by recruiters or students will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-background border rounded-xl shadow-sm min-h-[550px]">
            {/* Thread List Sidebar */}
            <div className="border-r p-4 space-y-2">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Conversations</h2>
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    activeThreadId === thread.id
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  <div className="text-sm truncate">{thread.subject || "Direct Message Thread"}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(thread.updated_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Thread Chat Box */}
            <div className="md:col-span-2 flex flex-col p-4">
              {errorMessage && (
                <div className="p-3 mb-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {errorMessage}
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2 border rounded-lg bg-muted/10 mb-4 min-h-[380px]">
                {messages.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-10">No messages in this conversation yet.</p>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === userId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-xl text-sm ${
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-background border text-foreground rounded-bl-none shadow-sm"
                          }`}
                        >
                          <div className="text-[10px] opacity-75 font-semibold mb-1">
                            {isMine ? "You" : msg.sender?.full_name || "User"}
                          </div>
                          <div>{msg.body}</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1">
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
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessageBody.trim()}
                  className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
