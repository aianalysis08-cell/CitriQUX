import { NextRequest, NextResponse } from "next/server";
import { getAnalysis, AnalysisRequest } from "@/lib/analysis-service";

export async function POST(request: NextRequest) {
  try {
    const { domainUrl } = await request.json();

    if (!domainUrl) {
      return NextResponse.json(
        { error: "Domain URL is required" },
        { status: 400 }
      );
    }

    console.log("Analyzing domain:", domainUrl);

    // Use the analysis service (currently free API, can be migrated to OpenAI)
    const analysisRequest: AnalysisRequest = {
      domainUrl,
      analysisType: "domain",
    };

    const result = await getAnalysis(analysisRequest);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to analyze domain" },
        { status: 500 }
      );
    }

    console.log("Domain analysis completed successfully");

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      provider: result.provider,
      domainUrl: result.domainUrl,
    });

  } catch (error: any) {
    console.error("Domain analysis error:", error);
    
    return NextResponse.json(
      { 
        error: `Failed to analyze domain: ${error.message || "Unknown error"}` 
      },
      { status: 500 }
    );
  }
}
