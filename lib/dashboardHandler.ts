import { auth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import { useState } from "react";


async function fetchData() {
      const { userId } = await auth();
      const router = useRouter()

    export default function FetchButton() {
        const [data, setData] = useState(null);
        const response = await fetch("/api/checkUserRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, userId }),
        });

    if (response.ok) {
      const { redirectUrl } = await response.json();
      router.push(redirectUrl);
    } else {
      alert("Failed to set role.");
    }
  };