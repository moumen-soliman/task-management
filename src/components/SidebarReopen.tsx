"use client";
import { PanelLeft } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";

/** Inline reopen control shown beside page titles while the sidebar is collapsed. */
export default function SidebarReopen() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);

  if (!collapsed) return null;

  return (
    <button
      type="button"
      onClick={() => setCollapsed(false)}
      title="Open sidebar"
      aria-label="Open sidebar"
      className="hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-[transform,color,background-color] duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:scale-110 focus-visible:bg-muted active:scale-95 md:flex"
    >
      <PanelLeft size={16} />
    </button>
  );
}
