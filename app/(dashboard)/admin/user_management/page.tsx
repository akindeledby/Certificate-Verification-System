"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string | null;
  isEnabled: boolean;
}

export default function UsersByRole() {
  const [users, setUsers] = useState<{ [key: string]: User[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/getUsersByRole");
        const data: { [key: string]: User[] } = await response.json();

        if (response.ok) {
          const updatedUsers = Object.fromEntries(
            Object.entries(data).map(([role, roleUsers]) => [
              role,
              roleUsers.map((user) => ({
                ...user,
                isEnabled: true,
              })),
            ])
          );

          setUsers(updatedUsers);
          setPageNumbers(
            Object.fromEntries(
              Object.keys(updatedUsers).map((role) => [role, 1])
            )
          );
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = (role: string, userId: string) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [role]: prevUsers[role].map((user) =>
        user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user
      ),
    }));
  };

  const itemsPerPage = 10;

  const handleNextPage = (role: string) => {
    setPageNumbers((prev) => ({ ...prev, [role]: (prev[role] || 1) + 1 }));
  };

  const handlePrevPage = (role: string) => {
    setPageNumbers((prev) => ({
      ...prev,
      [role]: Math.max(1, (prev[role] || 1) - 1),
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registered Users:</h2>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-rows-3 gap-4">
          {Object.entries(users).map(([role, roleUsers]) => {
            const currentPage = pageNumbers[role] || 1;
            const totalPages = Math.ceil(roleUsers.length / itemsPerPage);
            const paginatedUsers = roleUsers.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            );

            return (
              <Card key={role}>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{role}S</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.organization || "N/A"}</TableCell>
                          <TableCell>
                            <Button
                              variant={
                                user.isEnabled ? "destructive" : "default"
                              }
                              onClick={() => toggleUserStatus(role, user.id)}
                            >
                              {user.isEnabled ? "Disable" : "Enable"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => handlePrevPage(role)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => handleNextPage(role)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
