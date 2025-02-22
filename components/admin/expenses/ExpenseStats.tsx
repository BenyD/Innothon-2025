import { StatCard } from "@/components/admin/StatCard";
import { IndianRupee, Receipt, Stamp, CheckCircle2 } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseStatsProps {
  expenses: Expense[];
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingReimbursement = expenses
    .filter((exp) => !exp.is_reimbursed)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const needsStamp = expenses.filter(
    (exp) => exp.needs_stamp && !exp.is_reimbursed
  ).length;
  const reimbursed = expenses.filter((exp) => exp.is_reimbursed).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      <StatCard
        title="Total Expenses"
        value={`₹${totalExpenses.toLocaleString("en-IN")}`}
        icon={IndianRupee}
        color="text-green-400"
      />
      <StatCard
        title="Pending Reimbursement"
        value={`₹${pendingReimbursement.toLocaleString("en-IN")}`}
        icon={Receipt}
        color="text-yellow-400"
      />
      <StatCard
        title="Needs Stamp"
        value={needsStamp}
        icon={Stamp}
        color="text-red-400"
      />
      <StatCard
        title="Reimbursed"
        value={reimbursed}
        icon={CheckCircle2}
        color="text-blue-400"
      />
    </div>
  );
}
