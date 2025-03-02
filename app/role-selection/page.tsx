"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "institute", label: "Institute" },
  { value: "verifier", label: "Verifier" },
  { value: "guest", label: "Guest" },
];

const RoleSelectionForm: React.FC = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();

  const [role, setRole] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errors, setErrors] = useState<{
    role: string;
    organization: string;
    phoneNumber: string;
  }>({
    role: "",
    organization: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors = { role: "", organization: "", phoneNumber: "" };
    let isValid = true;

    if (!role) {
      newErrors.role = "Role selection is required.";
      isValid = false;
    }
    if (!organization.trim()) {
      newErrors.organization = "Organization name is required.";
      isValid = false;
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/setUserRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, organization, phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(data.redirectUrl);
      } else {
        alert(data.message || "Failed to update role.");
      }
    } catch (error) {
      console.error("Error setting role:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="md:text-2xl text-blue-800 text-center mb-4">
            Welcome, {user?.firstName || "User"}!<br /> Let&apos;s set up your
            dashboard first:
          </h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Proceed
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Fill in the correct details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
              aria-label="Select your role"
            >
              <option value="">Choose a role</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          {/* Organization Input */}
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              type="text"
              placeholder="Enter your organization or institute"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              aria-label="Enter your organization"
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">{errors.organization}</p>
            )}
          </div>

          {/* Phone number Input with react-phone-input-2 */}
          <div>
            <Label htmlFor="phoneNumber">Organization Phone Number</Label>
            <PhoneInput
              country={"ng"}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputStyle={{ width: "100%", padding: "10px", fontSize: "16px" }}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-500"
            disabled={loading || !role || !organization.trim() || !phoneNumber}
          >
            {loading ? "Saving..." : "Proceed to Dashboard"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionForm;
