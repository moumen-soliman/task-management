"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  Check,
  CheckSquare,
  ChevronDown,
  Layers,
  Loader2,
  ScanText,
  SlidersHorizontal,
  Ticket,
  UserPlus,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { CURRENT_USER } from "@/store/useActivityStore";
import { taskService } from "@/services/taskService";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Priorities, Status } from "@/types/Tasks";
import StatusHandler from "@/components/StatusHandler";
import PriorityHandler from "@/components/PriorityHandler";
import SidebarReopen from "@/components/SidebarReopen";
import MobileNav from "@/components/MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TICKET_TYPES = [
  { label: "Bug", dot: "bg-red-500" },
  { label: "Feature", dot: "bg-violet-500" },
  { label: "Improvement", dot: "bg-sky-500" },
] as const;

type TicketType = (typeof TICKET_TYPES)[number]["label"];

interface TicketMeta {
  type: TicketType;
  priority: Priorities;
  status: Status;
  assigneeId?: string;
  sprintId?: string;
}

type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "agent"; kind: "text"; text: string }
  | {
      id: string;
      role: "agent";
      kind: "details";
      title: string;
      meta: TicketMeta;
      assigneeName?: string;
      sprintName?: string;
    }
  | { id: string; role: "agent"; kind: "ticket"; ticketId: number; title: string; meta: TicketMeta };

const PROCESS_STAGES = [
  { icon: ScanText, text: "Reading your request…" },
  { icon: SlidersHorizontal, text: "Shaping title, priority and status…" },
  { icon: Ticket, text: "Creating the ticket…" },
];

const SUGGESTIONS = [
  "Login redirects to a blank page on Safari",
  "Board columns should collapse on mobile",
  "Add keyboard shortcuts for changing status",
];

// Optically aligned chip (icon side −2px), same pill language as the edit panel.
const chipClass =
  "inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border/60 pl-2 pr-2 text-xs outline-none transition-[transform,background-color,color] duration-200 ease-out hover:bg-muted/60 focus-visible:scale-[1.03] focus-visible:bg-muted active:scale-[0.97]";

/** The product mark doubles as the agent's identity — a done-check, not a robot. */
function AgentAvatar() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <CheckSquare size={12} />
    </span>
  );
}

interface ComposerProps {
  docked: boolean;
  value: string;
  busy: boolean;
  meta: TicketMeta;
  onChange: (value: string) => void;
  onMeta: (patch: Partial<TicketMeta>) => void;
  onSend: () => void;
}

function Composer({ docked, value, busy, meta, onChange, onMeta, onSend }: ComposerProps) {
  const users = useTaskStore((s) => s.users);
  const sprints = useTaskStore((s) => s.sprints);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownSide = docked ? "top" : "bottom";

  const type = TICKET_TYPES.find((t) => t.label === meta.type) ?? TICKET_TYPES[0];
  const assignee = users.find((user) => String(user.id) === meta.assigneeId);
  const sprint = sprints.find((s) => String(s.id) === meta.sprintId);

  // Auto-grow up to ~6 lines, then scroll.
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/95 shadow-[0_0_0_1px_hsl(var(--border)/0.3),0_8px_32px_rgb(0_0_0/0.08)] backdrop-blur-md transition-[box-shadow,border-color] duration-200 focus-within:border-border supports-[backdrop-filter]:bg-card/85">
      <textarea
        ref={textareaRef}
        rows={docked ? 1 : 2}
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={busy ? "Working on it…" : "Describe the issue - I'll shape it into a ticket"}
        aria-label="Describe the issue"
        className="max-h-40 w-full resize-none bg-transparent px-4 pt-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
      />

      {/* Property chips - one line; the chip strip scrolls, send stays pinned outside it */}
      <div className="flex items-center gap-1.5 px-2.5 pb-2.5 pt-1">
        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={chipClass}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${type.dot}`} />
              <span className="max-w-[84px] truncate">{type.label}</span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={dropdownSide} align="start" className="min-w-[130px]">
            {TICKET_TYPES.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className="cursor-pointer gap-2"
                onClick={() => onMeta({ type: option.label })}
              >
                <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={`${chipClass} capitalize`}>
              <PriorityHandler priority={meta.priority} variant="compact" />
              <span className="max-w-[64px] truncate">{meta.priority}</span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={dropdownSide} align="start" className="min-w-[120px]">
            {PRIORITIES_LIST.map((priority) => (
              <DropdownMenuItem
                key={priority}
                className="cursor-pointer capitalize"
                onClick={() => onMeta({ priority })}
              >
                {priority}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={`${chipClass} capitalize`}>
              <StatusHandler status={meta.status} showLabel={false} />
              <span className="max-w-[84px] truncate">{meta.status.replaceAll("_", " ")}</span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={dropdownSide} align="start" className="min-w-[130px]">
            {STATUS_LIST.map((status) => (
              <DropdownMenuItem
                key={status}
                className="cursor-pointer capitalize"
                onClick={() => onMeta({ status })}
              >
                {status.replaceAll("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={chipClass}>
              <UserPlus size={12} className="shrink-0 text-muted-foreground" />
              <span className={`max-w-[88px] truncate ${assignee ? "" : "text-muted-foreground"}`}>
                {assignee?.name ?? "Assign"}
              </span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={dropdownSide} align="start" className="min-w-[150px]">
            <DropdownMenuItem
              className="cursor-pointer text-muted-foreground"
              onClick={() => onMeta({ assigneeId: undefined })}
            >
              No assignee
            </DropdownMenuItem>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                className="cursor-pointer"
                onClick={() => onMeta({ assigneeId: String(user.id) })}
              >
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={chipClass}>
              <Layers size={12} className="shrink-0 text-muted-foreground" />
              <span
                className={`max-w-[88px] truncate capitalize ${sprint ? "" : "text-muted-foreground"}`}
              >
                {sprint?.name?.replaceAll("_", " ") ?? "Sprint"}
              </span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={dropdownSide} align="start" className="min-w-[140px]">
            <DropdownMenuItem
              className="cursor-pointer text-muted-foreground"
              onClick={() => onMeta({ sprintId: undefined })}
            >
              No sprint
            </DropdownMenuItem>
            {sprints.map((option) => (
              <DropdownMenuItem
                key={option.id}
                className="cursor-pointer capitalize"
                onClick={() => onMeta({ sprintId: String(option.id) })}
              >
                {option.name?.replaceAll("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        </div>

        {/* Pinned outside the scrollable strip — always reachable */}
        <div className="flex shrink-0 items-center gap-2.5 pl-1">
          <span className="hidden text-[11px] text-muted-foreground/50 md:block">
            ↵ send · ⇧↵ new line
          </span>
          <button
            type="button"
            onClick={onSend}
            disabled={busy || !value.trim()}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none transition-[transform,opacity] duration-150 ease-out focus-visible:scale-110 active:scale-[0.96] disabled:opacity-30"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const users = useTaskStore((s) => s.users);
  const sprints = useTaskStore((s) => s.sprints);
  const setTasks = useTaskStore((s) => s.setTasks);
  const setUsers = useTaskStore((s) => s.setUsers);
  const setSprints = useTaskStore((s) => s.setSprints);
  const shouldReduceMotion = useReducedMotion();

  const [messages, setMessages] = useState<Message[]>([]);
  const [processStage, setProcessStage] = useState<(typeof PROCESS_STAGES)[number] | null>(null);
  const [input, setInput] = useState("");
  const [meta, setMeta] = useState<TicketMeta>({
    type: "Feature",
    priority: "medium",
    status: "not_started",
  });
  const [createdCount, setCreatedCount] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  // Smart auto-scroll: follow new messages only while the user is at the bottom.
  const stickToBottom = useRef(true);

  const busy = processStage !== null;
  const started = messages.length > 0 || busy;

  // Chips need real users/sprints even when landing here directly.
  useEffect(() => {
    if (tasks.length === 0) {
      Promise.all([
        taskService.fetchTasks(),
        taskService.fetchUsers(),
        taskService.fetchSprints(),
      ]).then(([fetchedTasks, fetchedUsers, fetchedSprints]) => {
        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
        setSprints(fetchedSprints);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // The page scrolls inside the layout wrapper (body is overflow:hidden) —
  // resolve that scrollable ancestor once the thread exists.
  useEffect(() => {
    if (!started) return;
    let node: HTMLElement | null = endRef.current?.parentElement ?? null;
    while (node) {
      const { overflowY } = getComputedStyle(node);
      if (overflowY === "auto" || overflowY === "scroll") break;
      node = node.parentElement;
    }
    scrollParentRef.current = node;

    if (!node) return;
    const onScroll = () => {
      stickToBottom.current = node.scrollHeight - node.scrollTop - node.clientHeight < 120;
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [started]);

  const scrollToBottom = useCallback(
    (force = false) => {
      if (!force && !stickToBottom.current) return;
      // After paint, so the new message's height is measurable.
      requestAnimationFrame(() => {
        const el = scrollParentRef.current;
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: shouldReduceMotion ? "auto" : "smooth",
          });
        } else {
          endRef.current?.scrollIntoView({
            behavior: shouldReduceMotion ? "auto" : "smooth",
            block: "end",
          });
        }
      });
    },
    [shouldReduceMotion]
  );

  useEffect(() => {
    if (started) scrollToBottom();
  }, [messages, processStage, started, scrollToBottom]);

  const schedule = (fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || busy) return;

    const baseId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id) || 0)) + 1 : 115;
    const ticketId = baseId + createdCount;
    const stamp = Date.now();
    const snapshot = { ...meta };
    const assigneeName = users.find((user) => String(user.id) === snapshot.assigneeId)?.name;
    const sprintName = sprints
      .find((s) => String(s.id) === snapshot.sprintId)
      ?.name?.replaceAll("_", " ");
    const title = text.length > 72 ? `${text.slice(0, 72)}…` : text;

    setInput("");
    setMessages((prev) => [...prev, { id: `u-${stamp}`, role: "user", text }]);
    // Sending always re-engages the follow, even if the user had scrolled up.
    stickToBottom.current = true;
    scrollToBottom(true);

    // Static choreography - process shimmer → extracted details → ticket → follow-up.
    setProcessStage(PROCESS_STAGES[0]);
    schedule(() => setProcessStage(PROCESS_STAGES[1]), 1000);
    schedule(() => setProcessStage(PROCESS_STAGES[2]), 2000);
    schedule(() => {
      setProcessStage(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `a1-${stamp}`,
          role: "agent",
          kind: "details",
          title,
          meta: snapshot,
          assigneeName,
          sprintName,
        },
      ]);
    }, 2800);
    schedule(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a2-${stamp}`,
          role: "agent",
          kind: "ticket",
          ticketId,
          title,
          meta: snapshot,
        },
      ]);
      setCreatedCount((count) => count + 1);
    }, 3600);
    schedule(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a3-${stamp}`,
          role: "agent",
          kind: "text",
          text: "It would land at the top of your Issues list - open it there to edit details, or change status and priority straight from the navigation bar.",
        },
      ]);
    }, 4400);
  };

  const enterMotion = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { type: "spring" as const, bounce: 0, duration: 0.4 },
  };

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] w-full flex-col p-4">
      {/* Header - same row as Issues/History */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <MobileNav />
        <SidebarReopen />
        <h1 className="text-lg font-semibold">Agent</h1>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Static demo - not a real AI agent
        </span>
      </div>

      {!started ? (
        /* Hero - composer in the middle of the page */
        <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-24">
          <div className="space-y-1.5 text-center">
            <h2 className="text-xl font-semibold text-balance">
              What needs doing, {CURRENT_USER}?
            </h2>
            <p className="text-sm text-muted-foreground">
              Describe it once - the details live right on the box.
            </p>
          </div>

          <motion.div layout="position" className="w-full max-w-[760px]">
            <Composer
              docked={false}
              value={input}
              busy={busy}
              meta={meta}
              onChange={setInput}
              onMeta={(patch) => setMeta((prev) => ({ ...prev, ...patch }))}
              onSend={() => send()}
            />
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground outline-none transition-[transform,background-color,color] duration-200 ease-out hover:bg-muted/60 hover:text-foreground focus-visible:scale-[1.03] focus-visible:bg-muted active:scale-[0.97]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Thread - matches the composer column; the page header above stays full width */
        <div aria-live="polite" className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-4 pb-44">
          {messages.map((message) =>
            message.role === "user" ? (
              <motion.div key={message.id} {...enterMotion} className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-md bg-muted px-3.5 py-2 text-sm">
                  {message.text}
                </div>
              </motion.div>
            ) : message.kind === "text" ? (
              <motion.div key={message.id} {...enterMotion} className="flex gap-2.5">
                <AgentAvatar />
                <p className="max-w-[75%] pt-0.5 text-sm leading-relaxed text-pretty">
                  {message.text}
                </p>
              </motion.div>
            ) : message.kind === "details" ? (
              /* Extracted details — staggered rows, same icons as the composer chips */
              <motion.div
                key={message.id}
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="flex gap-2.5"
              >
                <AgentAvatar />
                <div className="w-full max-w-xl space-y-1">
                  <motion.p
                    variants={{
                      hidden: shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 8, filter: "blur(4px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                    className="pt-0.5 text-sm"
                  >
                    Here&apos;s what I put together from your request:
                  </motion.p>
                  <div className="space-y-0.5 pt-1">
                    {[
                      {
                        key: "title",
                        label: "Title",
                        value: <span className="truncate font-medium">{message.title}</span>,
                        icon: <ScanText size={13} className="text-muted-foreground" />,
                      },
                      {
                        key: "type",
                        label: "Type",
                        value: message.meta.type,
                        icon: (
                          <span
                            className={`h-2 w-2 rounded-full ${
                              TICKET_TYPES.find((t) => t.label === message.meta.type)?.dot
                            }`}
                          />
                        ),
                      },
                      {
                        key: "priority",
                        label: "Priority",
                        value: <span className="capitalize">{message.meta.priority}</span>,
                        icon: (
                          <PriorityHandler priority={message.meta.priority} variant="compact" />
                        ),
                      },
                      {
                        key: "status",
                        label: "Status",
                        value: (
                          <span className="capitalize">
                            {message.meta.status.replaceAll("_", " ")}
                          </span>
                        ),
                        icon: <StatusHandler status={message.meta.status} showLabel={false} />,
                      },
                      {
                        key: "assignee",
                        label: "Assignee",
                        value: message.assigneeName ?? (
                          <span className="text-muted-foreground">Unassigned</span>
                        ),
                        icon: <UserPlus size={13} className="text-muted-foreground" />,
                      },
                      {
                        key: "sprint",
                        label: "Sprint",
                        value: message.sprintName ? (
                          <span className="capitalize">{message.sprintName}</span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        ),
                        icon: <Layers size={13} className="text-muted-foreground" />,
                      },
                    ].map((row) => (
                      <motion.div
                        key={row.key}
                        variants={{
                          hidden: shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 8, filter: "blur(4px)" },
                          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                        }}
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                        className="flex items-center gap-2.5 rounded-md py-1 pr-2 text-sm"
                      >
                        <span className="flex w-5 shrink-0 justify-center">{row.icon}</span>
                        <span className="w-16 shrink-0 text-xs text-muted-foreground">
                          {row.label}
                        </span>
                        {row.value}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={message.id}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.95, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                // the one celebratory bounce
                transition={{
                  type: "spring",
                  duration: 0.5,
                  bounce: shouldReduceMotion ? 0 : 0.25,
                }}
                className="flex gap-2.5"
              >
                <AgentAvatar />
                <div className="w-full max-w-xl space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                      <Check size={10} />
                    </span>
                    Ticket #{message.ticketId} has been created
                  </p>
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm shadow-sm">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      #{message.ticketId}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{message.title}</span>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        TICKET_TYPES.find((t) => t.label === message.meta.type)?.dot
                      }`}
                      title={message.meta.type}
                    />
                    <PriorityHandler priority={message.meta.priority} variant="compact" />
                    <div className="hidden sm:block">
                      <StatusHandler status={message.meta.status} />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70">
                    Demo only - no real ticket was added to your board.
                  </p>
                </div>
              </motion.div>
            )
          )}

          {/* Process indicator - shimmering stage text, blur-crossfades between steps */}
          <AnimatePresence>
            {busy && (
              <motion.div
                key="process"
                {...enterMotion}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
                className="flex items-center gap-2.5"
              >
                {/* Spinner replaces the bot avatar while working */}
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Loader2 size={13} className="animate-spin text-muted-foreground" />
                </span>
                <span className="relative flex h-5 items-center overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={processStage?.text}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 8, filter: "blur(4px)" }
                      }
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -8, filter: "blur(4px)" }
                      }
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                      className="flex items-center gap-1.5"
                    >
                      {processStage && (
                        <processStage.icon size={13} className="shrink-0 text-muted-foreground" />
                      )}
                      <span className="animate-shimmer whitespace-nowrap bg-[linear-gradient(110deg,hsl(var(--muted-foreground))_35%,hsl(var(--foreground))_50%,hsl(var(--muted-foreground))_65%)] bg-[length:200%_100%] bg-clip-text text-sm text-transparent">
                        {processStage?.text}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} />
        </div>
      )}

      {/* Docked composer once the conversation starts.
          Positioning lives on the plain outer div — framer's y/opacity animation
          would overwrite the -translate-x-1/2 transform if they shared an element. */}
      <AnimatePresence>
        {started && (
          <div className="fixed bottom-4 left-1/2 z-40 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 md:left-[calc(50%+var(--sidebar-w,14rem)/2)] md:w-[min(760px,calc(100vw-var(--sidebar-w,14rem)-2rem))]">
            <motion.div
              key="docked-composer"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.45 }}
            >
              <Composer
                docked
                value={input}
                busy={busy}
                meta={meta}
                onChange={setInput}
                onMeta={(patch) => setMeta((prev) => ({ ...prev, ...patch }))}
                onSend={() => send()}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Progressive blur under the docked composer */}
      {started && (
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 h-32 backdrop-blur-md [mask-image:linear-gradient(to_top,black_25%,transparent)] md:left-[var(--sidebar-w,14rem)]"
        />
      )}
    </div>
  );
}
