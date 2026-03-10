import { NextRequest, NextResponse } from "next/server";
import { analyzeUX, UXAnalysisRequest } from "@/services/openai-ux-analysis";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const figmaUrl = formData.get('figmaUrl') as string;
    const files = formData.getAll('files') as File[];

    if (!figmaUrl && (!files || files.length === 0)) {
      return NextResponse.json(
        { error: "Either Figma URL or screenshot files are required" },
        { status: 400 }
      );
    }

    const analysisType = figmaUrl ? "figma" : "screenshots";
    
    console.log("Analyzing with OpenAI:", figmaUrl ? "Figma design" : `${files.length} screenshots`);

    // Use OpenAI for design analysis
    const analysisRequest: UXAnalysisRequest = {
      type: analysisType,
      figmaUrl: figmaUrl || undefined,
      files: files.length > 0 ? files : undefined,
    };

    const result = await analyzeUX(analysisRequest);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to analyze design" },
        { status: 500 }
      );
    }

    console.log("Design analysis completed successfully with OpenAI");

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      provider: result.provider,
      figmaUrl: figmaUrl || undefined,
      fileCount: files.length,
      scores: result.scores,
    });

  } catch (error: unknown) {
    console.error("Design analysis error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: `Failed to analyze design: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}
