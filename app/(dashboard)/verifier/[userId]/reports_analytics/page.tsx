"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const ReportsAnalytics = () => {
  const [totalIssued, setTotalIssued] = useState(0);
  const [verificationStats, setVerificationStats] = useState({
    success: 0,
    failed: 0,
    fraud: 0,
  });
  const [suspiciousAttempts, setSuspiciousAttempts] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  // Fetch reports & analytics data
  const fetchReportData = async () => {
    // Simulated fetch from DB/Blockchain
    setTotalIssued(1200);
    setVerificationStats({ success: 950, failed: 200, fraud: 50 });
    setSuspiciousAttempts([
      {
        id: "CERT-007",
        name: "Alice Brown",
        attemptDate: "2025-02-01",
        reason: "Tampered QR Code",
      },
      {
        id: "CERT-015",
        name: "Bob Williams",
        attemptDate: "2025-01-28",
        reason: "Duplicate Certificate",
      },
    ]);
  };

  // Data for bar chart
  const verificationData = [
    { label: "Successful", count: verificationStats.success },
    { label: "Failed", count: verificationStats.failed },
    { label: "Fraud Alerts", count: verificationStats.fraud },
  ];

  // Generate CSV report
  const exportCSV = () => {
    const csvData = [
      ["Total Certificates Issued", totalIssued],
      ["Successful Verifications", verificationStats.success],
      ["Failed Verifications", verificationStats.failed],
      ["Fraud Alerts", verificationStats.fraud],
      ["Suspicious Attempts"],
      ["Certificate ID", "Name", "Attempt Date", "Reason"],
      ...suspiciousAttempts.map((attempt) => [
        attempt.id,
        attempt.name,
        attempt.attemptDate,
        attempt.reason,
      ]),
    ];
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Institute_Report.csv");
  };

  // Generate PDF Report
  const ReportPDF = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Institute Report & Analytics</Text>
          <Text>Total Certificates Issued: {totalIssued}</Text>
          <Text>Successful Verifications: {verificationStats.success}</Text>
          <Text>Failed Verifications: {verificationStats.failed}</Text>
          <Text>Fraud Alerts: {verificationStats.fraud}</Text>
          <Text style={styles.subTitle}>Suspicious Verification Attempts:</Text>
          {suspiciousAttempts.map((attempt, index) => (
            <Text key={index}>
              {attempt.name} - {attempt.attemptDate} ({attempt.reason})
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="p-6 grid gap-6">
      <h2 className="text-3xl font-bold text-center">
        Institute Reports & Analytics
      </h2>

      {/* Total Certificates Issued */}
      <Card>
        <CardHeader>
          <CardTitle>Total Certificates Verified</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalIssued}</p>
        </CardContent>
      </Card>

      {/* Verification Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verificationData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Suspicious Verification Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Verification Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Attempt Date</TableHeader>
                <TableHeader>Reason</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {suspiciousAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.id}</TableCell>
                  <TableCell>{attempt.name}</TableCell>
                  <TableCell>{attempt.attemptDate}</TableCell>
                  <TableCell>{attempt.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <div className="flex space-x-4">
        <Button onClick={exportCSV} className="flex items-center">
          <FileDown size={16} className="mr-2" /> Export CSV
        </Button>
        <PDFDownloadLink
          document={<ReportPDF />}
          fileName="Institute_Report.pdf"
        >
          <Button className="flex items-center">
            <FileText size={16} className="mr-2" /> Export PDF
          </Button>
        </PDFDownloadLink>
      </div>
    </div>
  );
};

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { textAlign: "center", margin: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  subTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
});

export default ReportsAnalytics;
