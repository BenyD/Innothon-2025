"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Loader2, UserPlus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

// Helper function to get role badge styling
const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "super-admin":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "admin":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
};

// Helper function to format role display text
const formatRoleText = (role: string) => {
  // Split by hyphen and capitalize each word
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Settings() {
  const { role, loading: roleLoading } = useRole();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      // First get admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (adminError) throw adminError;

      // Sort users by role priority: super-admin > admin > member
      const sortedUsers = [...(adminUsers || [])].sort((a, b) => {
        // Define role priorities (lower number = higher priority)
        const rolePriority: Record<string, number> = {
          "super-admin": 1,
          admin: 2,
          member: 3,
        };

        // Get priorities, defaulting to a high number if role not found
        const priorityA = rolePriority[a.role] || 999;
        const priorityB = rolePriority[b.role] || 999;

        // Sort by priority first
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // If same priority, sort by creation date (newest first)
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      // Debug log to verify sorting
      console.log(
        "Sorted users by role:",
        sortedUsers.map((u) => `${u.email} (${u.role})`)
      );

      setUsers(sortedUsers);

      // Then get auth users using the service role key
      const {
        data: { users: authUsers },
        error: authError,
      } = await supabaseAdmin.auth.admin.listUsers();

      if (authError) throw authError;

      // Filter out users that are already in admin_users
      const adminUserIds = new Set((adminUsers || []).map((u) => u.id));
      const newAuthUsers = (authUsers || [])
        .filter((user) => !adminUserIds.has(user.id))
        .map((user) => ({
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
        }));

      setAuthUsers(newAuthUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (role === "super-admin") {
      fetchUsers();
    }
  }, [role, fetchUsers]);

  const handleAddToAdminUsers = async (
    authUser: AuthUser,
    selectedRole: string = "member"
  ) => {
    setUpdatingUserId(authUser.id);
    try {
      const { error } = await supabase.from("admin_users").insert({
        id: authUser.id,
        email: authUser.email,
        role: selectedRole,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User added successfully",
      });

      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from("admin_users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    setDeletingUserId(userId);

    try {
      // First remove from admin_users table
      const { error: adminError } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", userId);

      if (adminError) throw adminError;

      // Then delete the user from auth using admin client
      const { error: authError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      // Update local state
      setUsers(users.filter((user) => user.id !== userId));

      toast({
        title: "User deleted",
        description: `User ${email} has been successfully deleted.`,
      });
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
      setUserToDelete(null);
    }
  };

  if (roleLoading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (role !== "super-admin") {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="text-gray-400 mt-2">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">
            Manage user roles and add new users to the admin panel
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Sorted by role priority:
            </span>
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs rounded-full border",
                getRoleBadgeStyle("super-admin")
              )}
            >
              Super Admin
            </span>
            <span className="text-gray-400">&gt;</span>
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs rounded-full border",
                getRoleBadgeStyle("admin")
              )}
            >
              Admin
            </span>
            <span className="text-gray-400">&gt;</span>
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs rounded-full border",
                getRoleBadgeStyle("member")
              )}
            >
              Member
            </span>
          </div>
        </div>

        {/* New Users Section */}
        {authUsers.length > 0 && (
          <div className="bg-blue-500/10 rounded-lg overflow-hidden border border-blue-500/20">
            <div className="p-4 border-b border-blue-500/20">
              <h2 className="text-blue-400 font-medium">New Users</h2>
              <p className="text-sm text-gray-400">
                These users exist in authentication but haven&apos;t been
                assigned roles yet
              </p>
            </div>
            <table className="w-full">
              <tbody>
                {authUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-blue-500/20 last:border-0"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Select
                        defaultValue="member"
                        onValueChange={(newRole) =>
                          handleAddToAdminUsers(user, newRole)
                        }
                        disabled={updatingUserId === user.id}
                      >
                        <SelectTrigger className="w-[140px] bg-transparent border-white/10">
                          <SelectValue placeholder="Member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        onClick={() => handleAddToAdminUsers(user)}
                        disabled={updatingUserId === user.id}
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {updatingUserId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        <span className="ml-2">Add User</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Existing Users Table */}
        <div className="bg-white/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-medium">Existing Users</h2>
            <p className="text-sm text-gray-400">
              Manage roles for existing admin users (sorted by role priority)
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                  Added On
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={cn(
                    "border-b border-white/5",
                    // Add a subtle background to the first user of each role type
                    index === 0 || users[index - 1]?.role !== user.role
                      ? user.role === "super-admin"
                        ? "border-t-2 border-t-purple-500/30"
                        : user.role === "admin"
                          ? "border-t-2 border-t-blue-500/30"
                          : "border-t-2 border-t-green-500/30"
                      : ""
                  )}
                >
                  <td className="px-6 py-4 text-sm text-white">
                    {user.email}
                    <span
                      className={cn(
                        "ml-2 inline-block px-2 py-0.5 text-xs rounded-full border",
                        getRoleBadgeStyle(user.role)
                      )}
                    >
                      {formatRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user.id, newRole)
                      }
                      disabled={
                        updatingUserId === user.id || deletingUserId === user.id
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[140px] bg-transparent border-white/10",
                          getRoleBadgeStyle(user.role)
                        )}
                      >
                        <SelectValue placeholder={formatRoleText(user.role)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm flex items-center space-x-2">
                    {updatingUserId === user.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    )}
                    {deletingUserId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Button
                        onClick={() =>
                          setUserToDelete({ id: user.id, email: user.email })
                        }
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={updatingUserId === user.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete User Confirmation Dialog */}
        <AlertDialog
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
        >
          <AlertDialogContent className="bg-neutral-950 border border-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the
                user
                {userToDelete && ` "${userToDelete.email}"`} from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-transparent border border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() =>
                  userToDelete &&
                  handleDeleteUser(userToDelete.id, userToDelete.email)
                }
                disabled={!!deletingUserId}
              >
                {deletingUserId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <h3 className="text-purple-400 font-medium">How to add new users:</h3>
          <ol className="mt-2 text-sm text-gray-400 list-decimal list-inside space-y-1">
            <li>Go to the Supabase Authentication dashboard</li>
            <li>
              Click &quot;Add User&quot; and enter their email and password
            </li>
            <li>
              Return to this page and assign them a role using the New Users
              section
            </li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
