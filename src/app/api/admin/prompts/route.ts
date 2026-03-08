import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { createAdminClient } from "@/lib/supabase/server";
import { env } from "@/config/env";
import { z } from "zod";

export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  if (user!.email !== env.ADMIN_EMAIL) return errorResponse("Forbidden", 403);

  const supabase = await createAdminClient();
  const { data, error: dbError } = await supabase
    .from("ai_prompts")
    .select("*")
    .order("tool_name");

  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ data });
}

const updatePromptSchema = z.object({
  id: z.string().uuid(),
  system_prompt: z.string().min(10),
  user_prompt_template: z.string().min(5),
});

export async function PUT(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  if (user!.email !== env.ADMIN_EMAIL) return errorResponse("Forbidden", 403);

  let body;
  try {
    body = updatePromptSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  const supabase = await createAdminClient();

  const { data, error: dbError } = await supabase
    .from("ai_prompts")
    .update({
      system_prompt: body.system_prompt,
      user_prompt_template: body.user_prompt_template,
      version: typeof supabase.rpc === 'function' ? undefined : 1, // ideally increment
    })
    .eq("id", body.id)
    .select()
    .single();

  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ data });
}
