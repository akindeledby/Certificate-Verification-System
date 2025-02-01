import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
