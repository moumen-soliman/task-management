"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutList,
  History,
  MessagesSquare,
  Menu,
  Moon,
  Sun,
  CheckSquare,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Issues", icon: LayoutList },
  { href: "/history", label: "History", icon: History },
  { href: "/agent", label: "Agent", icon: MessagesSquare },
];

/**
 * Mobile navigation. Rendered beside each page title (below md); the desktop
 * Sidebar rail is hidden below md, so this hamburger + left drawer is the only
 * way to move between routes and toggle the theme there. Mirrors the rail's
 * brand / nav / footer structure and surface tokens.
 */
export default function MobileNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  // Client navigation keeps the drawer mounted - close it whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-[transform,color,background-color] duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:bg-muted active:scale-95"
      >
        <Menu size={18} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="flex w-72 max-w-[82vw] flex-col gap-0 border-r border-border/60 bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Brand */}
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
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg py-2 pl-2 pr-2.5 text-sm outline-none transition-colors ${
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

          {/* Footer - theme toggle, mirrors the desktop rail */}
          <div className="mt-auto border-t border-border px-3 py-3">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex w-full items-center gap-2.5 rounded-lg py-2 pl-2 pr-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-background/60 hover:text-foreground"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="truncate">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
