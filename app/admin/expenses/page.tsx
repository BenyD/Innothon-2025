"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";

export default function ExpenseTracker() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
            Expense Tracker
          </h1>
          <p className="text-gray-400 mt-1">Track and manage event expenses</p>
        </div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="p-3 rounded-full bg-teal-400/10 mb-4">
            <IndianRupee className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400 text-center max-w-md">
            The expense tracking feature is currently under development.
            You&apos;ll soon be able to manage and track all event-related
            expenses here.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
