import { NextResponse } from "next/server";

// Users list
const USERS = [
  { id: 1, name: "Alice Johnson", image: {
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  } },
  { id: 2, name: "Bob Smith",
    image: {
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    } 
   },
  { id: 3, name: "Charlie Davis",
    image: {
      url: "https://images.unsplash.com/photo-1502767089025-6572583495b9?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    } 
   },
  { id: 4, name: "David White",
    image: {
      url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    } 
   },
  { id: 5, name: "Emily Brown", image: {
    url: null
  }  },
];

export async function GET() {
  return NextResponse.json(USERS, { status: 200 });
}
