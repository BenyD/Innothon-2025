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
import { Loader2, UserPlus } from "lucide-react";

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

export default function Settings() {
  const { role, loading: roleLoading } = useRole();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      // First get admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (adminError) throw adminError;
      setUsers(adminUsers || []);

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
                          <SelectValue />
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
              Manage roles for existing admin users
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
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-white">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user.id, newRole)
                      }
                      disabled={updatingUserId === user.id}
                    >
                      <SelectTrigger className="w-[140px] bg-transparent border-white/10">
                        <SelectValue />
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
                  <td className="px-6 py-4 text-sm">
                    {updatingUserId === user.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
