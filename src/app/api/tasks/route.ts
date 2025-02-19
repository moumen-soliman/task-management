import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/data.json");

// Data from "src/data/data.json"
export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: "Task data file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    const tasks = JSON.parse(fileContent);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
