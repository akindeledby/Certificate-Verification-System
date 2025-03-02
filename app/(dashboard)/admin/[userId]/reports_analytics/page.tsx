"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"]; // Green, Yellow, Red

export default function CertificateStatistics() {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    issuedCertificates: 0,
    revokedCertificates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/getAllCertificateStats");
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        setError(data.error || "Failed to fetch statistics.");
      }
    } catch (err) {
      setError("Error fetching statistics.");
    } finally {
      setLoading(false);
    }
  };

  const barChartData = [
    { name: "Total Certificates", value: stats.totalCertificates },
    { name: "Issued Certificates", value: stats.issuedCertificates },
    { name: "Revoked Certificates", value: stats.revokedCertificates },
  ];

  const pieChartData = [
    { name: "Issued", value: stats.issuedCertificates },
    { name: "Revoked", value: stats.revokedCertificates },
    { name: "Total", value: stats.totalCertificates },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Certificate Statistics</h2>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {isClient && !loading && !error && (
        <>
          {/* Statistic Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-blue-100 border-blue-500 shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-blue-700">
                  Total Uploaded
                </h3>
                <p className="text-3xl font-semibold text-blue-900">
                  {stats.totalCertificates}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-100 border-green-500 shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-700">
                  Total Issued
                </h3>
                <p className="text-3xl font-semibold text-green-900">
                  {stats.issuedCertificates}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-100 border-red-500 shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-red-700">
                  Total Revoked
                </h3>
                <p className="text-3xl font-semibold text-red-900">
                  {stats.revokedCertificates}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Certificate Summary
                </h3>
                <BarChart width={400} height={250} data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4A90E2" />
                </BarChart>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">
                  Certificate Distribution
                </h3>
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
