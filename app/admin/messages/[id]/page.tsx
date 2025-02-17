"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User2, Check, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/types/contact";

export default function MessagePage() {
  const params = useParams();
  const [message, setMessage] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchMessage = useCallback(async () => {
    if (!params.id) return;
    
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setMessage(data);
    } catch (error) {
      console.error("Error fetching message:", error);
      toast({
        title: "Error",
        description: "Failed to load message details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  const handleResolve = async () => {
    if (!message) return;
    
    try {
      setIsResolving(true);
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", message.id);

      if (error) throw error;

      setMessage(prev => prev ? { ...prev, read: true } : null);
      toast({
        title: "Message marked as resolved",
        description: "The message has been successfully marked as resolved.",
      });
    } catch (error) {
      console.error("Error resolving message:", error);
      toast({
        title: "Error",
        description: "Failed to mark message as resolved",
        variant: "destructive",
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Messages
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : message ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Message from {message.name}
              </h1>
              <p className="text-gray-400 mt-1">View and manage contact message</p>
            </div>

            <div className="grid gap-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-400 mb-2">Contact Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <User2 className="w-4 h-4 text-blue-400" />
                      {message.name}
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Mail className="w-4 h-4 text-blue-400" />
                      {message.email}
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2">Message</h2>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
                  onClick={() => window.open(`mailto:${message.email}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply by Email
                </Button>
                {!message.read && (
                  <Button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isResolving ? "Resolving..." : "Mark as Resolved"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Message not found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 