"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ReportsPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [stats, setStats] = useState({
    totalCertificates: 0,
    issuedCertificates: 0,
    revokedCertificates: 0,
  });
  const [dailyTrend, setDailyTrend] = useState<
    { date: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
      fetchStatistics(storedWallet);
      fetchDailyTrend(storedWallet);
    } else {
      setLoading(false);
      setError("Wallet address not found.");
    }
  }, []);

  const fetchStatistics = async (wallet: string) => {
    try {
      const response = await fetch(
        `/api/getCertificateStats?walletAddress=${wallet}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to load statistics");

      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load statistics.");
    }
  };

  const fetchDailyTrend = async (wallet: string) => {
    try {
      const response = await fetch(
        `/api/getDailyUploadTrend?walletAddress=${wallet}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to load trend data");

      setDailyTrend(data);
    } catch (err) {
      console.error("Error fetching trend data:", err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: "Issued", value: stats.issuedCertificates, color: "#4CAF50" },
    { name: "Revoked", value: stats.revokedCertificates, color: "#FF5733" },
  ];

  const barData = [
    { name: "Total", count: stats.totalCertificates },
    { name: "Issued", count: stats.issuedCertificates },
    { name: "Revoked", count: stats.revokedCertificates },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Certificate Reports & Analytics
      </h2>

      {loading ? (
        <p>Loading statistics...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Total Certificates</h3>
              <p className="text-2xl font-bold">{stats.totalCertificates}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Issued Certificates</h3>
              <p className="text-2xl font-bold">{stats.issuedCertificates}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Revoked Certificates</h3>
              <p className="text-2xl font-bold">{stats.revokedCertificates}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">
                Issued vs. Revoked Certificates
              </h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">
                Certificate Distribution
              </h3>
              <BarChart width={400} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold mb-3">
              Daily Upload/Issuance Trend
            </h3>
            <BarChart width={600} height={300} data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
}
