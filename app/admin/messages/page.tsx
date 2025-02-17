"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, User2, Mail, Search, Filter, MessageSquare, ExternalLink, Check, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
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
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      setUpdating(messageId);
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );

      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

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

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    read: messages.filter(m => m.read).length,
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            variants={item}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Total Messages</p>
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
          </motion.div>
          
          <motion.div
            variants={item}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Unread Messages</p>
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.unread}</p>
          </motion.div>
          
          <motion.div
            variants={item}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Read Messages</p>
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.read}</p>
          </motion.div>
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

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </motion.div>
            ))
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                variants={item}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 
                  hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <User2 className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">{message.name}</span>
                      {!message.read && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
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
                    <p className="text-gray-300 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:w-[140px]">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-center 
                        flex items-center justify-center gap-2 group-hover:border-purple-500/20 border border-white/10"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    {!message.read && (
                      <Button
                        variant="outline"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={updating === message.id}
                        className="flex-1 border-white/10 hover:border-green-500/20 text-white hover:text-white 
                          bg-white/5 hover:bg-green-500/10"
                      >
                        {updating === message.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span className="ml-2">Mark Read</span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={item}
              className="text-center py-12 bg-white/5 rounded-xl border border-white/10"
            >
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">No messages found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? "Try adjusting your search or filters" : "Messages will appear here"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
