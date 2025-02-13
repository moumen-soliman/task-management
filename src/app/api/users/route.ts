import { NextResponse } from "next/server";

// Users list
const USERS = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Davis" },
  { id: 4, name: "David White" },
  { id: 5, name: "Emily Brown" },
];

export async function GET() {
  return NextResponse.json(USERS, { status: 200 });
}
