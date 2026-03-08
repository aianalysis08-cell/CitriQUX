import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import OpenAI from "openai";
import { env } from "@/config/env";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { z } from "zod";

const documentSchema = z.object({
  prompt: z.string().min(10).max(3000),
  type: z.enum(["ux-report", "test-plan", "audit-summary"]),
});

const _isBuildProcess = process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build" || process.env.CI;
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || (_isBuildProcess ? "dummy_key_for_build" : "")
});

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  let body;
  try {
    body = documentSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  try {
    await ensureAiEntitlement(user!.id, "ux-analysis");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      { role: "system", content: `Generate a professional ${body.type} document in markdown format.` },
      { role: "user", content: body.prompt },
    ],
    max_tokens: 4096,
    temperature: 0.4,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();

      await deductCredit(user!.id);
      await logAiUsage(user!.id, "document-generation", 2000, "gpt-4o");
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
