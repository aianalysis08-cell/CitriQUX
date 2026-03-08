import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { UPLOAD_LIMITS } from "@/config/constants";

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file) return errorResponse("No file provided");
  if (!projectId) return errorResponse("projectId is required");

  // Validate file
  if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
    return errorResponse(`File too large. Max size: ${UPLOAD_LIMITS.maxFileSizeMB}MB`);
  }

  if (!UPLOAD_LIMITS.allowedMimeTypes.includes(file.type as typeof UPLOAD_LIMITS.allowedMimeTypes[number])) {
    return errorResponse(`Invalid file type. Allowed: ${UPLOAD_LIMITS.allowedMimeTypes.join(", ")}`);
  }

  // Verify user owns the project
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("owner_id", user!.id)
    .single();

  if (!project) return errorResponse("Project not found or access denied", 403);

  // Upload to Supabase Storage
  const ext = file.name.split(".").pop() || "png";
  const filename = `${user!.id}/${projectId}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("design-uploads")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return errorResponse(`Upload failed: ${uploadError.message}`, 500);
  }

  // Get public URL (signed for private bucket)
  const { data: urlData } = await supabase.storage
    .from("design-uploads")
    .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 year

  const imageUrl = urlData?.signedUrl || filename;

  // Create design record
  const { data: design, error: dbError } = await supabase
    .from("designs")
    .insert({
      project_id: projectId,
      image_url: imageUrl,
      source_type: "upload",
      original_filename: file.name,
    })
    .select()
    .single();

  if (dbError) return errorResponse(dbError.message, 500);

  return NextResponse.json({ data: design }, { status: 201 });
}
