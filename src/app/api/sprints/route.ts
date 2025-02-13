import { NextResponse } from "next/server";

// Sprints list
const SPRINTS = [
  { id: 1, name: "Sprint Alpha", tasks: [1, 2, 3] },
  { id: 2, name: "Sprint Beta", tasks: [4, 5] },
];

export async function GET() {
  return NextResponse.json(SPRINTS, { status: 200 });
}
