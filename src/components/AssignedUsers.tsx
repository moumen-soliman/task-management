import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import { User } from "@/types/Users";

interface AssignedUsersProps {
  assignedUserIds: string[] | number[];
  getAssignedUser: User[] | string[];
}

export default function AssignedUsers({ getAssignedUser }: AssignedUsersProps) {
  const assignedUsers = useMemo(() => getAssignedUser as User[], [getAssignedUser]);

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {assignedUsers.length > 0 ? (
        assignedUsers.map((user, index) => (
          <TooltipProvider key={`${user.id}-${index}`}>
            <Tooltip>
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
          </TooltipProvider>
        ))
      ) : (
        <span className="text-gray-500">Not Assigned</span>
      )}
    </div>
  );
}
