import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  const response = await request.json();
  const id = context.params.id;

  const prompts = await prisma.prompt.findMany({});

  return NextResponse.json({ prompts });
}
