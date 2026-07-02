import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/Users";

interface AssignedUsersProps {
  assignedUserIds: string[] | number[];
  getAssignedUser: User[] | string[] | null | undefined;
  /** "md" (default) for cards, "sm" for dense table rows. */
  size?: "sm" | "md";
  /** When false, unassigned renders a subtle dashed avatar instead of "Not Assigned" text. */
  showEmptyText?: boolean;
  /** Cap the stack: renders at most `max` circles - extras collapse into a "+N" badge. */
  max?: number;
}

export default function AssignedUsers({
  getAssignedUser,
  size = "md",
  showEmptyText = true,
  max,
}: AssignedUsersProps) {
  const assignedUsers = (getAssignedUser ?? []) as User[]; // Ensure it's always an array

  const avatarSize = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8";

  // With a cap, overflow collapses into a "+N" circle occupying the last slot.
  const overflow = max !== undefined && assignedUsers.length > max;
  const visibleUsers = overflow ? assignedUsers.slice(0, max - 1) : assignedUsers;
  const hiddenUsers = overflow ? assignedUsers.slice(max - 1) : [];

  if (assignedUsers.length === 0) {
    if (showEmptyText) {
      return <span className="text-gray-500">Not Assigned</span>;
    }
    return (
      <span
        title="Unassigned"
        className={`inline-flex ${
          size === "sm" ? "h-6 w-6" : "h-8 w-8"
        } items-center justify-center rounded-full border border-dashed border-gray-300 dark:border-gray-600`}
        aria-label="Unassigned"
      />
    );
  }

  return (
    <div className="flex -space-x-2">
      <TooltipProvider>
        {visibleUsers.map((user, index) => (
          <Tooltip key={`${user.id}-${index}`}>
            <TooltipTrigger>
              <Avatar
                className={`inline-block ${avatarSize} shrink-0 rounded-full bg-gray-200 border border-white ring-1 ring-black/[0.06] dark:ring-white/10`}
              >
                <AvatarImage src={user.image?.url ?? ""} alt={user.name ?? ""} />
                <AvatarFallback>{user.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {hiddenUsers.length > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <span
                className={`flex ${avatarSize} shrink-0 items-center justify-center rounded-full border border-white bg-muted text-[10px] font-medium tabular-nums text-muted-foreground ring-1 ring-black/[0.06] dark:border-gray-800 dark:ring-white/10`}
              >
                +{hiddenUsers.length}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hiddenUsers.map((user) => user.name).join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
