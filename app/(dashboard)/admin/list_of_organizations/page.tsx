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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Organization {
  organization: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export default function OrganizationsList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrganizations = async (pageNumber: number, query: string = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/getAllOrganizations?page=${pageNumber}&limit=15&search=${query}`
      );
      const data = await response.json();

      if (response.ok) {
        setOrganizations(data.organizations);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch organizations");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations(page, searchQuery);
  }, [page, searchQuery]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Organizations & Contact Details
      </h2>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search organization..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page when searching
          }}
        />
        <Button onClick={() => fetchOrganizations(1, searchQuery)}>
          Search
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && organizations.length > 0 && (
        <>
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Contact Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org, index) => (
                    <TableRow key={index}>
                      <TableCell>{org.organization}</TableCell>
                      <TableCell>{org.role || "N/A"}</TableCell>
                      <TableCell>{org.email || "N/A"}</TableCell>
                      <TableCell>{org.phoneNumber || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {!loading && !error && organizations.length === 0 && (
        <p className="text-gray-500">No organizations found.</p>
      )}
    </div>
  );
}
