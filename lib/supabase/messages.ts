import { createClient } from "@/utils/supabase/client";
import { checkAndDeductMessageQuota } from "./employers";

export async function getUserMessageThreads(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .contains("participant_ids", [userId])
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching message threads:", error);
    return [];
  }
  return data || [];
}

export async function getThreadMessages(threadId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url, role)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching thread messages:", error);
    return [];
  }
  return data || [];
}

export async function sendMessage(
  threadId: string,
  senderId: string,
  recipientId: string,
  body: string,
  companyId?: string
) {
  const supabase = createClient();

  // Deduct quota if sent by employer
  if (companyId) {
    const quotaCheck = await checkAndDeductMessageQuota(companyId);
    if (!quotaCheck.allowed) {
      throw new Error(quotaCheck.message);
    }
  }

  // 1. Insert Message
  const { data: msg, error: msgError } = await supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: senderId,
      recipient_id: recipientId,
      body,
    })
    .select()
    .single();

  if (msgError) {
    throw new Error(`Failed to send message: ${msgError.message}`);
  }

  // 2. Update Thread Timestamp
  await supabase
    .from("message_threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", threadId);

  // 3. Trigger Realtime Notification for Recipient
  await supabase.from("notifications").insert({
    user_id: recipientId,
    type: "new_message",
    payload: {
      thread_id: threadId,
      message: body.slice(0, 100),
      sender_id: senderId,
    },
  });

  return msg;
}

export async function startMessageThread(
  employerUserId: string,
  studentUserId: string,
  companyId: string,
  subject: string,
  initialMessage: string
) {
  const supabase = createClient();

  // Enforce quota
  const quotaCheck = await checkAndDeductMessageQuota(companyId);
  if (!quotaCheck.allowed) {
    throw new Error(quotaCheck.message);
  }

  // 1. Create Thread
  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .insert({
      subject,
      participant_ids: [employerUserId, studentUserId],
    })
    .select()
    .single();

  if (threadError) {
    throw new Error(`Failed to create message thread: ${threadError.message}`);
  }

  // 2. Send Initial Message
  await supabase.from("messages").insert({
    thread_id: thread.id,
    sender_id: employerUserId,
    recipient_id: studentUserId,
    body: initialMessage,
  });

  // 3. Send Notification to Student
  await supabase.from("notifications").insert({
    user_id: studentUserId,
    type: "new_message",
    payload: {
      thread_id: thread.id,
      subject,
      message: initialMessage.slice(0, 100),
    },
  });

  return thread;
}

export async function getUserNotifications(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}
