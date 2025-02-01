"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex justify-start items-center">
          Courses
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex justify-start items-center">
          Price
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(price);

      return <div className="text-left text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <div className="flex justify-start items-center">
          Status
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Button variant="ghost" className="h-4 w-8 p-0 cursor-pointer">
          <Link href={`/teacher/courses/${id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      );
    },
  },
];

{
  /* 
  import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
  
  <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="ghost" className="h-4 w-8 p-0">
    <span className="sr-only">Open menu</span>
    <MoreHorizontal className="h-4 w-4" />
  </Button>
</DropdownMenuTrigger>
<DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <Link href={`/teacher/courses/${id}`}>
      <DropdownMenuItem className="cursor-pointer">
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
    </Link>
  </DropdownMenuContent>
</DropdownMenuTrigger>
</DropdownMenu> */
}
