import { NextRequest, NextResponse } from "next/server";
import { getAnalysis, AnalysisRequest } from "@/lib/analysis-service";

export async function POST(request: NextRequest) {
  try {
    const { figmaUrl, screenshotFiles } = await request.json();

    if (!figmaUrl && (!screenshotFiles || screenshotFiles.length === 0)) {
      return NextResponse.json(
        { error: "Either Figma URL or screenshot files are required" },
        { status: 400 }
      );
    }

    const analysisType = figmaUrl ? "figma" : "screenshots";
    
    console.log("Analyzing:", figmaUrl ? "Figma design" : `${screenshotFiles?.length} screenshots`);

    // Use the analysis service (currently free API, can be migrated to Gemini)
    const analysisRequest: AnalysisRequest = {
      figmaUrl: figmaUrl || undefined,
      screenshotFiles: screenshotFiles || [],
      analysisType,
    };

    const result = await getAnalysis(analysisRequest);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to analyze design" },
        { status: 500 }
      );
    }

    console.log("Design analysis completed successfully");

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      provider: result.provider,
      figmaUrl: result.figmaUrl,
      fileCount: result.fileCount,
    });

  } catch (error: any) {
    console.error("Design analysis error:", error);
    
    return NextResponse.json(
      { 
        error: `Failed to analyze design: ${error.message || "Unknown error"}` 
      },
      { status: 500 }
    );
  }
}
