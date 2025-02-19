import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/Users";

interface AssignedUsersProps {
  assignedUserIds: string[] | number[];
  getAssignedUser: User[] | string[] | null | undefined;
}

export default function AssignedUsers({ getAssignedUser }: AssignedUsersProps) {
  const assignedUsers = (getAssignedUser ?? []) as User[]; // Ensure it's always an array

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {assignedUsers.length > 0 ? (
        <TooltipProvider>
          {assignedUsers.map((user, index) => (
            <Tooltip key={`${user.id}-${index}`}>
              <TooltipTrigger>
                <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200">
                  <AvatarImage src={user.image?.url ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback>{user.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      ) : (
        <span className="text-gray-500">Not Assigned</span>
      )}
    </div>
  );
}
