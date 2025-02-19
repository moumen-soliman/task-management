import SheetPanel from "@/components/SheetPanel";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import BoardContainer from "@/components/BoardContainer";
import SkeletonTable from "@/components/Table/SkeletonTable";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<SkeletonTable />}>
        <BoardContainer />
      </Suspense>
      <SheetPanel />
      <Toaster />
    </div>
  );
}
