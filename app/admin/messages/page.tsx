"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, User2, Mail, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/types/contact";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Messages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
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

  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ||
        (filter === "read" && message.read) ||
        (filter === "unread" && !message.read);

      return matchesSearch && matchesFilter;
    });

  return (
    <AdminLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Contact Messages
          </h2>
          <p className="text-gray-400 mt-1">
            View and manage contact form submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value: "all" | "read" | "unread") => setFilter(value)}
          >
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white hover:bg-white/10 focus:ring-0">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-white/10">
              <SelectItem value="all" className="text-white focus:bg-white/10 focus:text-white">
                All Messages
              </SelectItem>
              <SelectItem value="read" className="text-white focus:bg-white/10 focus:text-white">
                Read
              </SelectItem>
              <SelectItem value="unread" className="text-white focus:bg-white/10 focus:text-white">
                Unread
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                variants={item}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User2 className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">{message.name}</span>
                      {!message.read && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {message.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              No messages found
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
