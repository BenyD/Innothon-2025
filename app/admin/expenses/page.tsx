"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/admin/expenses/AddExpenseModal";
import { ExpenseList } from "@/components/admin/expenses/ExpenseList";
import { ExpenseStats } from "@/components/admin/expenses/ExpenseStats";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expense";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { motion } from "framer-motion";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchExpenses = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setRefreshing(true);
        }

        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setExpenses(data || []);

        if (showToast) {
          toast({
            title: "Expenses refreshed",
            description: "Latest expense data has been loaded",
          });
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive",
        });
      } finally {
        if (showToast) {
          setRefreshing(false);
        }
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <AdminLayout>
      <RoleGuard
        allowedRoles={["super-admin", "admin"]}
        fallback={
          <div className="p-6 text-center">
            <h2 className="text-xl font-medium text-gray-400">
              You don&apos;t have permission to view expenses
            </h2>
          </div>
        }
      >
        <div className="p-2 sm:p-6 space-y-6">
          {/* Header with Title and Actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
          >
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Expense Tracker
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Track and manage event expenses
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchExpenses(true)}
                disabled={refreshing}
                className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              >
                {refreshing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>

              <RoleGuard
                allowedRoles={["super-admin", "admin"]}
                fallback={null}
              >
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-white hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </RoleGuard>
            </div>
          </motion.div>

          {/* Stats Section */}
          <ExpenseStats expenses={expenses} />

          {/* Expenses List */}
          <div className="rounded-xl overflow-hidden">
            <ExpenseList expenses={expenses} onUpdate={fetchExpenses} />
          </div>

          {/* Add Expense Modal */}
          <AddExpenseModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchExpenses();
            }}
          />
        </div>
      </RoleGuard>
    </AdminLayout>
  );
}
