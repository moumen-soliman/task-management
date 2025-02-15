import SheetPanel from "@/components/SheetPanel";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import BoardContainer from "@/components/BoardContainer";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <BoardContainer />
      </Suspense>
      <SheetPanel />
      <Toaster />
    </div>
  );
}
