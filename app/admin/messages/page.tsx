"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Mail, Calendar, User, Check, PhoneCall } from "lucide-react";
import Link from "next/link";

interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleModalClose = () => {
    setSelectedMessage(null);
  };

  const handleMessageResolved = () => {
    fetchMessages(); // Refresh the messages list
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Contact Messages
          </h2>
          <p className="text-gray-400 mt-1">
            View and manage contact form submissions
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message, index) => (
              <Link
                key={message.id}
                href={`/admin/messages/${message.id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">
                            {message.name}
                          </span>
                          {message.read && (
                            <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Resolved
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span className="hover:text-white transition-colors">
                          {message.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <PhoneCall className="w-4 h-4" />
                        <span className="hover:text-white transition-colors">
                          {message.phone}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
