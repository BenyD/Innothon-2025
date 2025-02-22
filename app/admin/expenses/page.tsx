"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/admin/expenses/AddExpenseModal";
import { ExpenseList } from "@/components/admin/expenses/ExpenseList";
import { ExpenseStats } from "@/components/admin/expenses/ExpenseStats";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expense";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header Section - Improved mobile layout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
              Expense Tracker
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Track and manage event expenses
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-teal-400/10 to-emerald-400/10 hover:from-teal-400/20 hover:to-emerald-400/20 border border-teal-400/20"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>

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
    </AdminLayout>
  );
}
