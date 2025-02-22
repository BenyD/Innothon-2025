"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Stamp, CheckCircle2, Trash2, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Expense } from "@/types/expense";
import { getExpenseBillUrl } from "@/lib/upload-helper";

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: () => void;
}

export function ExpenseList({ expenses, onUpdate }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusUpdate = async (
    id: string,
    field: string,
    value: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleViewBill = async (billFile: string) => {
    try {
      const url = await getExpenseBillUrl(billFile);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error getting bill URL:", error);
      toast({
        title: "Error",
        description: "Failed to load bill",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">
                    {expense.bill_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    By {expense.person_name}
                  </p>
                  {expense.bill_number && (
                    <p className="text-sm text-gray-500">
                      Bill #{expense.bill_number}
                    </p>
                  )}
                </div>
                <p className="text-lg font-semibold text-white">
                  ₹{expense.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-1">
                {expense.items.map((item: string, index: number) => (
                  <p key={index} className="text-sm text-gray-400">
                    {item} × {expense.quantity[index]}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {expense.bill_file && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      expense.bill_file && handleViewBill(expense.bill_file)
                    }
                    className="text-teal-400 hover:text-teal-300 hover:bg-teal-400/10"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Bill
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    expense.needs_stamp ? "text-yellow-400" : "text-neutral-400"
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      expense.id,
                      "needs_stamp",
                      !expense.needs_stamp
                    )
                  }
                >
                  <Stamp className="w-4 h-4 mr-2" />
                  {expense.needs_stamp ? "Needs Stamp" : "Stamped"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    expense.is_reimbursed
                      ? "text-green-400"
                      : "text-neutral-400"
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      expense.id,
                      "is_reimbursed",
                      !expense.is_reimbursed
                    )
                  }
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {expense.is_reimbursed ? "Reimbursed" : "Not Reimbursed"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-500 hover:bg-red-400/10 ml-auto"
                  onClick={() => setDeleteId(expense.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
