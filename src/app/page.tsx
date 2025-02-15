import SheetPanel from "@/components/SheetPanel";
import { Toaster } from "@/components/ui/toaster";
import Table from "@/components/Table";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Table />
      </Suspense>
      <SheetPanel />
      <Toaster />
    </div>
  );
}
