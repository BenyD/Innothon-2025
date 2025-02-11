"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, Check, X, PhoneCall, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
}

export default function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchMessage();
  }, [resolvedParams.id]);

  async function fetchMessage() {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("id", resolvedParams.id)
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
  }

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
        variant: "success",
      });
    } catch (error) {
      console.error("Error resolving message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark message as resolved. Please try again.",
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
          onClick={() => router.push("/admin/messages")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Messages
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : message ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Message from {message.name}
              </h1>
              <p className="text-gray-400 mt-1">
                View and manage contact message
              </p>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">{message.name}</span>
                  {message.read && (
                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Resolved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a
                    href={`mailto:${message.email}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {message.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-green-400" />
                  <a
                    href={`tel:${message.phone}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {message.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-300">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2">Message</h2>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
                  onClick={() => window.open(`mailto:${message.email}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply by Email
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
                  onClick={() => window.open(`tel:${message.phone}`)}
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call
                </Button>
                {!message.read && (
                  <Button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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