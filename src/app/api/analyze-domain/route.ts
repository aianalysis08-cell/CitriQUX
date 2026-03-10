import { NextRequest, NextResponse } from "next/server";
import { analyzeUX, UXAnalysisRequest } from "@/services/openai-ux-analysis";

export async function POST(request: NextRequest) {
  try {
    const { domainUrl } = await request.json();

    if (!domainUrl) {
      return NextResponse.json(
        { error: "Domain URL is required" },
        { status: 400 }
      );
    }

    console.log("Analyzing domain with OpenAI:", domainUrl);

    // Use OpenAI for domain analysis
    const analysisRequest: UXAnalysisRequest = {
      type: 'domain',
      domainUrl,
    };

    const result = await analyzeUX(analysisRequest);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to analyze domain" },
        { status: 500 }
      );
    }

    console.log("Domain analysis completed successfully with OpenAI");

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      provider: result.provider,
      domainUrl: domainUrl,
      scores: result.scores,
    });

  } catch (error: unknown) {
    console.error("Domain analysis error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: `Failed to analyze domain: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}
