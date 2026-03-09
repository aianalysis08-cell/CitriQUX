import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { z } from "zod";
import OpenAI from "openai";
import type {
    BenchmarkSite,
    SiteAnalysis,
    CategoryWinner,
    OpportunityItem,
    AIStrategicInsight,
    BenchmarkCategory,
    GapItem
} from "@/types";

const schema = z.object({
    ownUrl: z.string().url(),
    ownLabel: z.string().min(1).max(50).default('My Site'),
    competitors: z.array(z.object({
        url: z.string().url(),
        label: z.string().min(1).max(50)
    })).min(1).max(3),
    industry: z.string().optional(),
    primaryGoal: z.string().optional()
});

function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function buildFaviconUrl(domain: string): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function buildBenchmarkSystemPrompt(industry?: string, primaryGoal?: string): string {
    return `
You are a senior UX strategist and competitive analyst with 15+ years of experience
analyzing digital products. You specialize in comparative UX evaluation.

Your task is to analyze multiple websites simultaneously and produce a comprehensive
competitive UX benchmark report.

${industry ? `INDUSTRY CONTEXT: ${industry}` : ''}
${primaryGoal ? `PRIMARY GOAL TO OPTIMIZE FOR: ${primaryGoal}` : ''}

SCORING SYSTEM:
Score each site 0.0 to 10.0 (one decimal place) on these 9 dimensions:
- visualDesign: Typography, color, whitespace, visual polish, brand consistency
- navigation: Item count, label clarity, IA, breadcrumbs, search, mobile nav
- accessibility: Contrast ratios, font sizes, ARIA indicators, keyboard nav signs
- mobileUX: Touch targets, responsive layout, mobile CTA, content priority
- ctaClarity: CTA visibility, contrast, placement frequency, action language
- pageSpeedFeel: Perceived performance, skeleton loading, transitions, LCP feel
- trustSignals: Reviews, logos, certifications, team pages, security badges
- contentQuality: Clarity, scannability, F-pattern support, value proposition
- conversionFlow: Friction reduction, form simplicity, checkout flow, signup UX

SCORING RULES:
- Scores must be RELATIVE to each other — if Site A is clearly better than Site B
  on navigation, A's score must be meaningfully higher than B's
- Do not give every site the same score for a category — differentiate clearly
- 9.0-10.0 = World-class, industry-leading
- 7.0-8.9 = Good, above average
- 5.0-6.9 = Average, needs work
- 3.0-4.9 = Poor, significant issues
- 0-2.9 = Broken or critically deficient
- Overall score = weighted average (conversion and accessibility weighted 1.5x)

ANALYSIS APPROACH:
For each site, evaluate based on:
1. Your knowledge of the domain and brand from your training data
2. Common UX patterns for this type of site/industry
3. Competitive positioning relative to the other submitted sites
4. WCAG 2.1 AA standards for accessibility scoring
5. Nielsen's heuristics for usability scoring
6. CRO best practices for conversion scoring

BLUE OCEAN OPPORTUNITIES:
Identify 3-5 UX areas where ALL submitted sites perform poorly (< 6.5 average).
These represent first-mover advantages for whoever improves them first.

STRATEGIC INSIGHT:
The aiInsight section must be genuinely strategic — not generic advice.
Reference specific scores, specific competitors, specific opportunities.
The positioningStatement must name the user's strongest category and
their most urgent gap relative to the named competitors.

RESPONSE FORMAT:
Return ONLY valid JSON. No prose, no markdown, no backticks. Just JSON.

{
  "sites": [
    {
      "domain": "string — exact domain as submitted",
      "scores": {
        "overall": 0.0,
        "visualDesign": 0.0,
        "navigation": 0.0,
        "accessibility": 0.0,
        "mobileUX": 0.0,
        "ctaClarity": 0.0,
        "pageSpeedFeel": 0.0,
        "trustSignals": 0.0,
        "contentQuality": 0.0,
        "conversionFlow": 0.0
      },
      "strengths": ["string", "string", "string"],
      "weaknesses": ["string", "string", "string"],
      "keyFindings": "string — 2-3 sentences specific to this site",
      "aboveTheFold": "string — specific assessment of hero/above-fold UX",
      "ctaAssessment": "string — specific assessment of CTA strategy",
      "trustAssessment": "string — specific assessment of trust signals"
    }
  ],
  "categoryWinners": [
    {
      "category": "visualDesign",
      "categoryLabel": "Visual Design",
      "winningSite": "domain string",
      "winningScore": 0.0,
      "margin": 0.0
    }
  ],
  "opportunities": [
    {
      "title": "string — short opportunity name",
      "description": "string — why this is a blue ocean",
      "averageScore": 0.0,
      "estimatedImpact": "high|medium|low",
      "effort": "high|medium|low"
    }
  ],
  "aiInsight": {
    "positioningStatement": "string — 2-3 sentences naming user's position",
    "competitiveAdvantages": ["string", "string", "string"],
    "criticalGaps": ["string", "string", "string"],
    "thirtyDayPlan": {
      "week1_2": "string — specific action",
      "week3": "string — specific action",
      "week4": "string — specific action"
    },
    "winProbability": {
      "description": "string — overall win assessment",
      "details": ["string", "string"]
    },
    "marketOpening": "string — single biggest untapped opportunity"
  }
}
`;
}

function buildBenchmarkUserPrompt(sites: BenchmarkSite[]): string {
    const ownSite = sites.find(s => s.isOwn)!;
    const competitors = sites.filter(s => !s.isOwn);

    return `
Please analyze these websites for a competitive UX benchmark:

USER'S OWN SITE (this is who the strategic advice should be directed to):
  Domain: ${ownSite.domain}
  URL: ${ownSite.url}
  Label: ${ownSite.label}

COMPETITOR SITES:
${competitors.map((s, i) => `
  Competitor ${i + 1}:
  Domain: ${s.domain}
  URL: ${s.url}
  Label: ${s.label}
`).join('')}

Analyze all ${sites.length} sites simultaneously.
Score them relative to each other — not in isolation.
Direct all strategic advice (aiInsight) to the owner of ${ownSite.domain}.
Return ONLY valid JSON as specified in your instructions.
`;
}

export async function POST(request: NextRequest) {
    const { user, supabase } = await getAuthUser();
    // if (error) return error; // BYPASSED FOR TESTING

    try {
        const rawBody = await request.json();
        const parsed = schema.safeParse(rawBody);

        if (!parsed.success) {
            return errorResponse(`Invalid request body: ${parsed.error.message}`, 400);
        }

        const body = parsed.data;

        // Fetch user profile to enforce limits
        let plan = "free";
        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("subscription_plan")
                .eq("id", user.id)
                .single();

            if (profile?.subscription_plan) {
                plan = profile.subscription_plan;
            }
        }
        const maxCompetitors = plan === "free" ? 1 : plan === "pro" ? 3 : 10;

        if (body.competitors.length > maxCompetitors) {
            return NextResponse.json(
                { error: 'Upgrade to Pro to benchmark more competitors', upgrade: true },
                { status: 403 }
            );
        }

        const allSites: BenchmarkSite[] = [
            {
                url: body.ownUrl,
                domain: extractDomain(body.ownUrl),
                label: body.ownLabel,
                isOwn: true,
                faviconUrl: buildFaviconUrl(extractDomain(body.ownUrl))
            },
            ...body.competitors.map(c => ({
                url: c.url,
                domain: extractDomain(c.url),
                label: c.label,
                isOwn: false,
                faviconUrl: buildFaviconUrl(extractDomain(c.url))
            }))
        ];

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 6000,
            messages: [
                {
                    role: 'system',
                    content: buildBenchmarkSystemPrompt(body.industry, body.primaryGoal)
                },
                {
                    role: 'user',
                    content: buildBenchmarkUserPrompt(allSites)
                }
            ]
        });

        const raw = completion.choices[0].message.content ?? '';
        const clean = raw.replace(/```json|```/g, '').trim();

        let aiParsed: {
            sites: (Omit<SiteAnalysis, 'site'> & { domain: string })[];
            categoryWinners: CategoryWinner[];
            opportunities: OpportunityItem[];
            aiInsight: AIStrategicInsight;
        };

        try {
            aiParsed = JSON.parse(clean);
        } catch {
            return errorResponse('Failed to parse AI response', 500);
        }

        // Merge parsed data with our site metadata
        const sites: SiteAnalysis[] = aiParsed.sites
            .map(s => ({
                ...s,
                site: allSites.find(a => a.domain === s.domain)!
            }))
            .sort((a, b) => b.scores.overall - a.scores.overall)
            .map((s, i) => ({ ...s, rank: i + 1 }));

        // Build gap analysis for user's own site
        const ownSite = sites.find(s => s.site.isOwn)!;
        const competitors = sites.filter(s => !s.site.isOwn);

        const categories: { key: BenchmarkCategory; label: string }[] = [
            { key: 'visualDesign', label: 'Visual Design' },
            { key: 'navigation', label: 'Navigation' },
            { key: 'accessibility', label: 'Accessibility' },
            { key: 'mobileUX', label: 'Mobile UX' },
            { key: 'ctaClarity', label: 'CTA Clarity' },
            { key: 'pageSpeedFeel', label: 'Page Speed Feel' },
            { key: 'trustSignals', label: 'Trust Signals' },
            { key: 'contentQuality', label: 'Content Quality' },
            { key: 'conversionFlow', label: 'Conversion Flow' }
        ];

        const gapAnalysis: GapItem[] = categories.map(({ key, label }) => {
            const yourScore = ownSite.scores[key];
            const marketAverage = competitors.reduce(
                (sum, s) => sum + s.scores[key], 0
            ) / competitors.length;
            const gap = yourScore - marketAverage;

            return {
                category: key,
                categoryLabel: label,
                yourScore,
                marketAverage: Math.round(marketAverage * 10) / 10,
                gap: Math.round(gap * 10) / 10,
                severity: (gap < -1 ? 'critical' : gap < 0 ? 'warning' : 'winning') as 'critical' | 'warning' | 'winning',
                recommendation: aiParsed.aiInsight.criticalGaps.find(
                    g => g.toLowerCase().includes(label.toLowerCase())
                ) ?? `Improve ${label} to reach market average`
            };
        }).sort((a, b) => a.gap - b.gap);

        // Save to Supabase
        let savedId = null;
        if (user) {
            const { data: saved, error: saveError } = await supabase
                .from('benchmark_results')
                .insert({
                    user_id: user.id,
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    sites: sites as any,
                    category_winners: aiParsed.categoryWinners as any,
                    gap_analysis: gapAnalysis as any,
                    opportunities: aiParsed.opportunities as any,
                    ai_insight: aiParsed.aiInsight as any,
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                    plan_used: plan
                })
                .select('id')
                .single();

            if (saveError) {
                console.error('Failed to save benchmark:', saveError.message);
            }
            if (saved?.id) {
                savedId = saved.id;
            }
        }

        return NextResponse.json({
            id: savedId,
            sites,
            categoryWinners: aiParsed.categoryWinners,
            gapAnalysis,
            opportunities: aiParsed.opportunities,
            aiInsight: aiParsed.aiInsight,
            createdAt: new Date().toISOString()
        });

    } catch (err) {
        console.error("Benchmark API error:", err);
        return errorResponse(err instanceof Error ? err.message : "Benchmark failed", 500);
    }
}
