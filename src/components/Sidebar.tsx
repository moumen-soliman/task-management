"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutList, History, MessagesSquare, Moon, Sun, CheckSquare } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";

const NAV_ITEMS = [
  { href: "/", label: "Issues", icon: LayoutList },
  { href: "/history", label: "History", icon: History },
  { href: "/agent", label: "Agent", icon: MessagesSquare },
];

const MIN_WIDTH = 180;
const MAX_WIDTH = 400;
const CLOSE_BELOW = 140; // dragging narrower than this closes the sidebar

/**
 * Fixed left navigation rail (Linear-style), resizable by dragging its right
 * edge. Dragging below CLOSE_BELOW collapses it; dragging back out re-opens.
 * Width is published as --sidebar-w so the content offset and the ActionIsland
 * follow it live. Hidden below md.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const width = useSidebarStore((s) => s.width);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setWidth = useSidebarStore((s) => s.setWidth);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = Number(localStorage.getItem("sidebar-width"));
    if (saved >= MIN_WIDTH && saved <= MAX_WIDTH) setWidth(saved);
    setCollapsed(localStorage.getItem("sidebar-collapsed") === "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Publish the width so layout padding + island centering track it live.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty(
      "--sidebar-w",
      collapsed ? "0px" : `${width}px`
    );
    localStorage.setItem("sidebar-width", String(width));
    localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
  }, [width, collapsed, mounted]);

  const startResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const onMove = (ev: PointerEvent) => {
      if (ev.clientX < CLOSE_BELOW) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, ev.clientX)));
      }
    };
    const onUp = () => {
      setDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.removeEventListener("pointermove", onMove);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  }, [setCollapsed, setWidth]);

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {!collapsed && (
    <motion.aside
      key="sidebar-rail"
      aria-label="Navigation"
      style={{ width }}
      // Asymmetric per make-interfaces-feel-better: slide in on enter,
      // fade + blur in place on exit - no slide back out.
      initial={shouldReduceMotion ? false : { x: "calc(-100% - 4px)", opacity: 1 }}
      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
      exit={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }
      }
      transition={{ type: "spring", duration: 0.45, bounce: 0 }}
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border/60 bg-sidebar md:flex"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <CheckSquare size={15} />
        </div>
        <span className="truncate text-sm font-semibold">Task Manager</span>
      </div>

      {/* Pages */}
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg pl-2 pr-2.5 py-1.5 text-sm outline-none transition-[transform,background-color,color,box-shadow] duration-200 ease-out focus-visible:scale-[1.03] focus-visible:bg-background/70 active:scale-[0.98] ${
                active
                  ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-border px-3 py-3">
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-2.5 rounded-lg pl-2 pr-2.5 py-1.5 text-sm text-muted-foreground outline-none transition-[transform,background-color,color] duration-200 ease-out focus-visible:scale-[1.03] focus-visible:bg-background/70 hover:bg-background/60 hover:text-foreground active:scale-[0.98]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="truncate">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        )}
      </div>

      {/* Resize handle - drag to resize, drag far left to close */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onPointerDown={startResize}
        className={`absolute -right-0.5 inset-y-0 w-1.5 cursor-col-resize transition-colors ${
          dragging ? "bg-primary/30" : "hover:bg-primary/20"
        }`}
      />
    </motion.aside>
      )}
    </AnimatePresence>
  );
}
