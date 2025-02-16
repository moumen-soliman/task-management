import SheetPanel from "@/components/SheetPanel";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import BoardContainer from "@/components/BoardContainer";
import Container from "@/components/ui/container";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BoardContainer />
      </Suspense>
      <SheetPanel />
      <Toaster />
    </div>
  );
}
