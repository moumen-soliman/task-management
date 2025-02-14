import { NextResponse } from "next/server";

// Sprints list
const SPRINTS = [
  { id: 1, name: "Sprint Alpha" },
  { id: 2, name: "Sprint Beta" },
];

export async function GET() {
  return NextResponse.json(SPRINTS, { status: 200 });
}
