"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { uploadExpenseBill } from "@/lib/upload-helper";
import { useRole } from "@/hooks/useRole";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddExpenseModal({
  open,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    billName: "",
    personName: "",
    billNumber: "",
    items: [""],
    quantities: [1],
    amount: "",
    needsStamp: true,
    isReimbursed: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { role } = useRole();

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, ""],
      quantities: [...prev.quantities, 1],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      quantities: prev.quantities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'super-admin' && role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add expenses",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);

    try {
      let billFile = null;
      if (file) {
        billFile = await uploadExpenseBill(file);
      }

      const { error } = await supabase.from("expenses").insert({
        bill_name: formData.billName,
        person_name: formData.personName,
        bill_number: formData.billNumber || null,
        items: formData.items,
        quantity: formData.quantities,
        amount: parseFloat(formData.amount),
        needs_stamp: formData.needsStamp,
        is_reimbursed: formData.isReimbursed,
        bill_file: billFile,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense added successfully",
      });

      onSuccess();
      setFormData({
        billName: "",
        personName: "",
        billNumber: "",
        items: [""],
        quantities: [1],
        amount: "",
        needsStamp: true,
        isReimbursed: false,
      });
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-neutral-950 border border-neutral-800 w-[95vw] sm:w-full mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6 pb-4 bg-gradient-to-r from-teal-400/10 to-emerald-400/10 border-b border-neutral-800 sticky top-0 z-10 backdrop-blur-sm">
          <DialogTitle className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
            Add New Expense
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            Fill in the details to add a new expense record
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="billName"
                className="text-sm font-medium text-neutral-200"
              >
                Bill Name
              </Label>
              <Input
                id="billName"
                value={formData.billName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    billName: e.target.value,
                  }))
                }
                className="bg-neutral-900/50 border-neutral-800 text-neutral-100 focus:ring-teal-400/20 focus:border-teal-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="personName"
                className="text-sm font-medium text-neutral-200"
              >
                Person Name
              </Label>
              <Input
                id="personName"
                value={formData.personName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personName: e.target.value,
                  }))
                }
                className="bg-neutral-900/50 border-neutral-800 text-neutral-100 focus:ring-teal-400/20 focus:border-teal-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="billNumber"
                className="text-sm font-medium text-neutral-200"
              >
                Bill Number (Optional)
              </Label>
              <Input
                id="billNumber"
                value={formData.billNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    billNumber: e.target.value,
                  }))
                }
                className="bg-neutral-900/50 border-neutral-800 text-neutral-100 focus:ring-teal-400/20 focus:border-teal-400/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-neutral-200">
                Items & Quantities
              </Label>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Item name"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index] = e.target.value;
                        setFormData((prev) => ({ ...prev, items: newItems }));
                      }}
                      className="bg-neutral-900/50 border-neutral-800 text-neutral-100 flex-1 focus:ring-teal-400/20 focus:border-teal-400/20"
                      required
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={formData.quantities[index]}
                        onChange={(e) => {
                          const newQuantities = [...formData.quantities];
                          newQuantities[index] = parseInt(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            quantities: newQuantities,
                          }));
                        }}
                        className="bg-neutral-900/50 border-neutral-800 text-neutral-100 w-24 focus:ring-teal-400/20 focus:border-teal-400/20"
                        required
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="w-full bg-neutral-900/50 border-neutral-800 text-white hover:bg-neutral-800 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-neutral-200"
              >
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="bg-neutral-900/50 border-neutral-800 text-neutral-100 focus:ring-teal-400/20 focus:border-teal-400/20"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needsStamp"
                  checked={formData.needsStamp}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      needsStamp: checked as boolean,
                    }))
                  }
                  className="border-neutral-700 data-[state=checked]:bg-teal-400 data-[state=checked]:border-teal-400"
                />
                <Label
                  htmlFor="needsStamp"
                  className="text-sm text-neutral-200"
                >
                  Needs Stamp
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isReimbursed"
                  checked={formData.isReimbursed}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isReimbursed: checked as boolean,
                    }))
                  }
                  className="border-neutral-700 data-[state=checked]:bg-teal-400 data-[state=checked]:border-teal-400"
                />
                <Label
                  htmlFor="isReimbursed"
                  className="text-sm text-neutral-200"
                >
                  Reimbursed
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-200">
                Upload Bill
              </Label>
              <div className="border-2 border-dashed border-neutral-800 rounded-lg p-4">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-neutral-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer"
                />
                <p className="mt-2 text-xs text-neutral-400">
                  Supported formats: PDF, PNG, JPG (max 5MB)
                </p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="h-1 w-full bg-neutral-800 rounded-full">
                      <div
                        className="h-1 bg-teal-400 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {file && (
                  <p className="mt-2 text-sm text-neutral-200 truncate">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 -mx-4 px-4 pb-4 pt-2 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent sm:static sm:bg-none sm:p-0 sm:m-0">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-black font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
