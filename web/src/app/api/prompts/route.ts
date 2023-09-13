import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prompts = await prisma.prompt.findMany({});

  return NextResponse.json(prompts, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
