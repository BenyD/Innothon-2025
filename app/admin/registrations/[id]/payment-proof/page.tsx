"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

export default function PaymentProofViewer() {
  const params = useParams();
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState<string>("");

  const getSignedUrl = async (fileName: string) => {
    try {
      if (!fileName) return null;

      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .createSignedUrl(fileName, 60); // 60 seconds expiry

      if (error) {
        console.error("Error getting signed URL:", error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error("Error in getSignedUrl:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPaymentProof = async () => {
      try {
        const { data, error } = await supabase
          .from("registrations")
          .select("payment_proof")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (data?.payment_proof) {
          setFileName(data.payment_proof);
          const url = await getSignedUrl(data.payment_proof);
          if (url) {
            setSignedUrl(url);
          }
        }
      } catch (error) {
        console.error("Error fetching payment proof:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentProof();
  }, [params.id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </AdminLayout>
    );
  }

  if (!signedUrl) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center text-gray-400">
            Payment proof not found or expired
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <a
            href={signedUrl}
            download={fileName}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>

        <div className="relative max-w-4xl mx-auto bg-white/5 rounded-xl p-4">
          <Image
            src={signedUrl}
            alt="Payment Proof"
            width={1200}
            height={1600}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
      </div>
    </AdminLayout>
  );
} 