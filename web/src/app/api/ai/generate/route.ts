import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const bodySchema = z.object({
    videoId: z.string().uuid(),
    template: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
  });

  const { videoId, template, temperature } = bodySchema.parse(request.body);

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    },
  });

  if (!video.transcription) {
    return NextResponse.json(
      { error: "No transcription was found for this video." },
      {
        status: 400,
      }
    );
  }

  const promptMessage = template.replace("{transcription}", video.transcription);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    temperature,
    messages: [{ role: "user", content: promptMessage }],
  });

  return NextResponse.json(response.choices[0].message);
}
