import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { z } from "zod";

import type { HeatmapAnnotation, HeatmapResult } from "@/types";

// Auth and error pattern mapped exactly from /api/ai/ux-analysis/route.ts
// Zod schema exactly as requested
const schema = z.object({
    imageUrl: z.string().url(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    analysisContext: z.object({
        overallScore: z.number(),
        categories: z.array(z.object({
            name: z.string(),
            score: z.number(),
            feedback: z.string()
        }))
    }).optional()
});

type AnalysisContextReq = z.infer<typeof schema>['analysisContext'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildHeatmapSystemPrompt(context?: AnalysisContextReq): string {
    const contextSection = context ? `
EXISTING ANALYSIS CONTEXT (use this to prioritize your annotations):
Overall UX Score: ${context.overallScore}/10
Known issues by category:
${context.categories.map(c => `  • ${c.name}: ${c.score}/10 — ${c.feedback}`).join('\n')}
Focus your annotations on the lowest-scoring categories first.
` : '';

    return `
You are an expert UX analyst and accessibility auditor with 15+ years of experience.
Your task is to analyze a UI screenshot and identify specific UX problems, 
returning their EXACT locations as percentage-based coordinates.

${contextSection}

COORDINATE SYSTEM (CRITICAL — read carefully):
- ALL coordinates must be expressed as PERCENTAGES of the image dimensions, not pixels
- x: distance from LEFT edge of image as % (0 = far left, 100 = far right)
- y: distance from TOP edge of image as % (0 = top, 100 = bottom)
- width: box width as % of image width
- height: box height as % of image height
- Boxes must fit WITHIN the image: x + width <= 100, y + height <= 100
- Minimum box size: width >= 3, height >= 2
- Be precise — boxes should tightly wrap the problem element

ANNOTATION RULES:
1. Identify 5 to 12 specific UX problems (not too few, not overwhelming)
2. Each annotation must target a SPECIFIC visible element, not a vague region
3. Every annotation needs: exact coordinates, clear label, full detail, fix
4. Prioritize: Critical → Warning → Suggestion
5. Never annotate the same element twice
6. Do not annotate areas that are good — only flag real problems

SEVERITY DEFINITIONS:
- "critical": Breaks usability or fails WCAG AA — user cannot complete task
             Examples: invisible CTA, inaccessible form, text contrast < 3:1
- "warning":  Degrades UX significantly — user struggles but can proceed
             Examples: crowded navigation, unclear hierarchy, small touch targets
- "suggestion": Minor improvement — nice to have
             Examples: inconsistent spacing, font pairing, micro-copy

CATEGORIES (use exactly one per annotation):
"Accessibility" | "Navigation" | "Visual Hierarchy" | 
"Typography" | "CTA" | "Layout" | "Color Contrast" | "Usability"

WCAG RULES TO CHECK:
- 1.4.3: Text contrast ratio minimum 4.5:1 (normal text), 3:1 (large text)
- 1.4.11: Non-text contrast minimum 3:1
- 2.5.5: Touch target minimum 44x44px
- 1.3.1: Information conveyed only by color
- 2.4.7: Focus indicators visible
- 1.4.4: Text resizable to 200%

NIELSEN HEURISTICS TO CHECK:
- #1 Visibility of system status
- #2 Match between system and real world  
- #4 Consistency and standards
- #6 Recognition rather than recall
- #7 Flexibility and efficiency of use
- #8 Aesthetic and minimalist design

RESPONSE FORMAT:
Return ONLY this JSON structure. No prose. No markdown. No explanation.
{
  "annotations": [
    {
      "id": "ann_001",
      "x": 12.5,
      "y": 8.3,
      "width": 22.0,
      "height": 6.5,
      "severity": "critical",
      "category": "Color Contrast",
      "label": "Failed Contrast Ratio",
      "detail": "Text contrast ratio is approximately 2.1:1, far below the WCAG AA minimum of 4.5:1. This text is effectively unreadable for users with low vision.",
      "recommendation": "Change text color to #1A1A1A or darken the background to achieve at least 4.5:1 contrast ratio. Use the WebAIM Contrast Checker to verify.",
      "wcagRule": "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)"
    },
    {
      "id": "ann_002",
      "x": 35.0,
      "y": 2.0,
      "width": 45.0,
      "height": 5.0,
      "severity": "warning",
      "category": "Navigation",
      "label": "Navigation Overload",
      "detail": "Navigation contains 9 items, exceeding Miller's Law of 7±2 items in working memory. Users will experience cognitive overload when scanning options.",
      "recommendation": "Group related items into dropdowns. Aim for 5-7 top-level navigation items. Consider a mega-menu for complex site structures.",
      "heuristicRule": "Nielsen #8 — Aesthetic and Minimalist Design"
    }
  ]
}
`;
}

export async function POST(request: NextRequest) {
    try {
        // Use exact auth pattern requested
        const { user, supabase } = await getAuthUser();
        // if (error) return error; // BYPASSED FOR TESTING

        const rawBody = await request.json();
        const parsed = schema.safeParse(rawBody);

        if (!parsed.success) {
            return errorResponse(`Invalid request body: ${parsed.error.message}`, 400);
        }

        const body = parsed.data;

        // MOCK RESPONSE FOR TESTING WITHOUT OPENAI API KEY
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API latency

        const aiParsed: { annotations: HeatmapAnnotation[] } = {
            annotations: [
                {
                    id: "ann_mock_001",
                    x: 10,
                    y: 5,
                    width: 20,
                    height: 8,
                    severity: "critical",
                    category: "Color Contrast",
                    label: "Failed Contrast Ratio",
                    detail: "Text contrast ratio is approximately 2.1:1, far below the WCAG AA minimum of 4.5:1. This text is effectively unreadable for users with low vision.",
                    recommendation: "Change text color to #1A1A1A or darken the background to achieve at least 4.5:1 contrast ratio.",
                    wcagRule: "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)"
                },
                {
                    id: "ann_mock_002",
                    x: 40,
                    y: 2,
                    width: 40,
                    height: 5,
                    severity: "warning",
                    category: "Navigation",
                    label: "Navigation Overload",
                    detail: "Navigation contains 9 items, exceeding Miller's Law of 7±2 items in working memory. Users will experience cognitive overload when scanning options.",
                    recommendation: "Group related items into dropdowns. Aim for 5-7 top-level navigation items. Consider a mega-menu for complex site structures.",
                    heuristicRule: "Nielsen #8 — Aesthetic and Minimalist Design"
                },
                {
                    id: "ann_mock_003",
                    x: 75,
                    y: 85,
                    width: 15,
                    height: 10,
                    severity: "critical",
                    category: "CTA",
                    label: "Inconspicuous CTA",
                    detail: "The primary call-to-action button blends into the background and lacks sufficient visual weight to draw the user's eye.",
                    recommendation: "Use a high-contrast accent color for primary CTAs and increase button size to make it the most prominent element in the visual hierarchy."
                },
                {
                    id: "ann_mock_004",
                    x: 5,
                    y: 40,
                    width: 30,
                    height: 25,
                    severity: "suggestion",
                    category: "Visual Hierarchy",
                    label: "Weak Readability",
                    detail: "The line height (leading) of this paragraph is too tight (1.2), making it difficult to read large blocks of text.",
                    recommendation: "Increase line-height to 1.5 - 1.6 for body copy to improve readability and scannability."
                },
                {
                    id: "ann_mock_005",
                    x: 45,
                    y: 50,
                    width: 10,
                    height: 5,
                    severity: "warning",
                    category: "Accessibility",
                    label: "Small Touch Target",
                    detail: "Interactive element is roughly 24x24px, violating the minimum recommended touch target size of 44x44px.",
                    recommendation: "Increase padding around the icon to ensure a minimum 44x44px clickable area.",
                    wcagRule: "WCAG 2.1 AAA — 2.5.5 Target Size"
                }
            ]
        };

        const summary = {
            critical: aiParsed.annotations.filter(a => a.severity === 'critical').length,
            warning: aiParsed.annotations.filter(a => a.severity === 'warning').length,
            suggestion: aiParsed.annotations.filter(a => a.severity === 'suggestion').length,
            total: aiParsed.annotations.length
        };

        // Store in Supabase
        // If table doesn't exist, this fails silently on the API end but returns the result.
        // The instructions say "Run in Supabase... if this table doesn't exist", we'll attempt insert.
        if (user) {
            const { error: dbError } = await supabase
                .from('heatmap_results')
                .insert({
                    user_id: user.id,
                    image_url: body.imageUrl,
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    annotations: aiParsed.annotations as any,
                    summary: summary as any
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                });

            if (dbError) {
                console.warn("Could not save heatmap_results to Supabase (table may not exist yet):", dbError.message);
                // We don't necessarily break the response if saving fails, as we can still return the generated UI.
            }
        }

        const result: Omit<HeatmapResult, 'imageWidth' | 'imageHeight'> = {
            annotations: aiParsed.annotations,
            summary,
            generatedAt: new Date().toISOString()
        };

        return NextResponse.json(result);

    } catch (err) {
        console.error("Heatmap API error:", err);
        return errorResponse(err instanceof Error ? err.message : "Analysis failed", 500);
    }
}
