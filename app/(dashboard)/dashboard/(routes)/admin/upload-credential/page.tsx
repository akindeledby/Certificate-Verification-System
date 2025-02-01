"use-client";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <div className="mb-5 flex justify-end">
        <Link href="/teacher/create">
          <Button variant="destructive" className="text-white">
            New Course
          </Button>
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
