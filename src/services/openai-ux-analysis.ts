import OpenAI from 'openai';
import { uploadMultipleImages, validateImageFile } from '@/lib/image-upload';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface UXAnalysisRequest {
  type: 'domain' | 'screenshots' | 'figma';
  domainUrl?: string;
  files?: File[];
  figmaUrl?: string;
}

export interface UXAnalysisResponse {
  success: boolean;
  analysis: string;
  scores: UXScoreBreakdown;
  grade: string;
  classification: string;
  executiveSummary: {
    keyStrengths: string[];
    criticalIssues: string[];
    quickWins: string[];
  };
  provider: 'openai';
  error?: string;
}

export interface UXScoreBreakdown {
  overall: number;
  visual: number;
  navigation: number;
  usability: number;
  accessibility: number;
  mobile: number;
  content: number;
  conversion: number;
  journey: number;
}

// Enhanced system prompt for more accurate UX analysis
const UX_ANALYSIS_PROMPT = `You are a senior UX/UI consultant with 20+ years of experience at world-class companies like Apple, Google, Meta, and Airbnb. You have conducted over 1,000 professional UX audits and your insights have helped products achieve 200%+ user satisfaction improvements.

Your task is to provide a comprehensive, data-driven UX analysis that goes beyond surface-level observations. Focus on actionable insights that can immediately improve the user experience.

ANALYSIS FRAMEWORK:
1. **Visual Design & Aesthetics** - Visual hierarchy, consistency, brand alignment, emotional impact
2. **Navigation & Information Architecture** - Findability, mental models, cognitive load, wayfinding
3. **User Experience & Usability** - Task completion, error prevention, efficiency, learnability
4. **Accessibility** - WCAG compliance, inclusive design, assistive technology support
5. **Mobile Responsiveness** - Touch interactions, viewport optimization, mobile-first principles
6. **Content & Copy** - Clarity, tone, readability, information scent
7. **Conversion Optimization** - CTA effectiveness, friction reduction, trust signals
8. **User Journey & Flow** - Task flows, micro-interactions, state management

SCORING CRITERIA (1.0-10.0):
- 9.0-10.0: World-class, industry-leading
- 8.0-8.9: Professional, high-quality
- 7.0-7.9: Good with room for improvement
- 6.0-6.9: Adequate but needs attention
- 5.0-5.9: Below average, requires significant work
- 1.0-4.9: Critical issues requiring immediate attention

Provide your analysis in this exact format:

## Overall Assessment
**Overall UX Score: X.X/10**
**Grade:** [A+/A/A-/B+/B/B-/C+/C/C-/D/F]
**User Experience Classification:** [World-Class/Professional/Good/Adequate/Needs Improvement/Critical]

## Executive Summary
**Key Strengths:** [2-3 bullet points of what works exceptionally well]
**Critical Issues:** [2-3 bullet points of most urgent problems]
**Quick Wins:** [2-3 bullet points of easy, high-impact improvements]

## Detailed Analysis

### 1. Visual Design & Aesthetics (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Specific, observable strengths with examples]
- [Technical design principles that are well-executed]

**Areas for Improvement:**
- [Specific, actionable issues with severity levels]
- [Design principles that need refinement]

**Impact:** [How this affects user perception and behavior]

### 2. Navigation & Information Architecture (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Navigation patterns that work well]
- [Information organization strengths]

**Areas for Improvement:**
- [Navigation friction points]
- [IA improvements needed]

**Impact:** [Effect on user findability and mental models]

### 3. User Experience & Usability (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Usability patterns that excel]
- [User task completion strengths]

**Areas for Improvement:**
- [Usability barriers and friction]
- [Task completion improvements]

**Impact:** [Effect on user efficiency and satisfaction]

### 4. Accessibility (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Accessibility features that work well]
- [Inclusive design elements]

**Areas for Improvement:**
- [WCAG compliance gaps]
- [Accessibility barriers]

**Impact:** [Effect on user inclusion and compliance]

### 5. Mobile Responsiveness (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Mobile design strengths]
- [Touch interaction patterns]

**Areas for Improvement:**
- [Mobile optimization gaps]
- [Touch target issues]

**Impact:** [Effect on mobile user experience]

### 6. Content & Copy (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Content quality and clarity]
- [Copy effectiveness]

**Areas for Improvement:**
- [Content gaps and clarity issues]
- [Copy optimization needs]

**Impact:** [Effect on user understanding and engagement]

### 7. Conversion Optimization (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [Conversion elements that work]
- [Trust signals and social proof]

**Areas for Improvement:**
- [Conversion friction points]
- [CTA optimization needs]

**Impact:** [Effect on business metrics and user actions]

### 8. User Journey & Flow (X.X/10)
**Score Rationale:** [Specific explanation for this score]
**Strengths:**
- [User flow patterns that excel]
- [Journey smoothness factors]

**Areas for Improvement:**
- [Journey friction and drop-off points]
- [Flow optimization needs]

**Impact:** [Effect on task completion and user retention]

## Strategic Recommendations

### 🔴 Critical Priority (Fix within 1-2 weeks)
1. **[Issue Title]** - [Specific issue] → **Expected Impact:** [+X% user satisfaction, +X% conversion]
2. **[Issue Title]** - [Specific issue] → **Expected Impact:** [+X% task completion, +X% accessibility]

### 🟡 High Priority (Address within 1 month)
1. **[Improvement Title]** - [Specific improvement] → **Expected Impact:** [+X% efficiency, +X% engagement]
2. **[Improvement Title]** - [Specific improvement] → **Expected Impact:** [+X% mobile experience, +X% retention]

### 🟢 Medium Priority (Plan for next quarter)
1. **[Enhancement Title]** - [Specific enhancement] → **Expected Impact:** [+X% brand perception, +X% user delight]
2. **[Enhancement Title]** - [Specific enhancement] → **Expected Impact:** [+X% competitive advantage, +X% innovation]

## Implementation Roadmap
**Week 1-2:** Focus on critical accessibility and usability fixes
**Week 3-4:** Address high-priority navigation and conversion issues
**Month 2:** Implement medium-priority enhancements and optimizations
**Month 3:** Monitor metrics and refine based on user feedback

## Success Metrics
**User Satisfaction:** Target +X% improvement (measured by user surveys)
**Task Completion Rate:** Target +X% improvement (measured by analytics)
**Conversion Rate:** Target +X% improvement (measured by business metrics)
**Accessibility Score:** Target WCAG AA compliance (measured by accessibility tools)

**IMPORTANT:** Be extremely specific and actionable. Base your analysis on what you can actually observe in the provided designs. Provide concrete examples and measurable recommendations. Use precise language and avoid vague suggestions.`;

// Function to capture screenshot from URL (placeholder for now)
async function captureWebsiteScreenshot(url: string): Promise<string> {
  // For production, implement using Puppeteer, Playwright, or screenshot API
  // For now, we'll analyze based on URL structure
  throw new Error('Screenshot capture not implemented yet - analyzing based on URL structure');
}

// Function to capture Figma design screenshot (placeholder for now)
async function captureFigmaScreenshot(figmaUrl: string): Promise<string> {
  // For production, implement using Figma API
  // For now, we'll analyze based on URL structure
  throw new Error('Figma screenshot capture not implemented yet - analyzing based on URL structure');
}

// Enhanced function to extract comprehensive scores and metadata from AI response
function extractScoresFromAnalysis(analysis: string): UXScoreBreakdown & { 
  grade: string; 
  classification: string; 
  executiveSummary: {
    keyStrengths: string[];
    criticalIssues: string[];
    quickWins: string[];
  };
} {
  const scores: UXScoreBreakdown = {
    overall: 7.0,
    visual: 7.0,
    navigation: 7.0,
    usability: 7.0,
    accessibility: 7.0,
    mobile: 7.0,
    content: 7.0,
    conversion: 7.0,
    journey: 7.0,
  };

  // Extract overall score
  const overallMatch = analysis.match(/Overall UX Score:\s*(\d+\.?\d+)\/10/);
  if (overallMatch) scores.overall = parseFloat(overallMatch[1]) || 7.0;

  // Extract individual category scores
  const visualMatch = analysis.match(/Visual Design & Aesthetics\s*\((\d+\.?\d+)\/10\)/);
  if (visualMatch) scores.visual = parseFloat(visualMatch[1]) || 7.0;

  const navigationMatch = analysis.match(/Navigation & Information Architecture\s*\((\d+\.?\d+)\/10\)/);
  if (navigationMatch) scores.navigation = parseFloat(navigationMatch[1]) || 7.0;

  const usabilityMatch = analysis.match(/User Experience & Usability\s*\((\d+\.?\d+)\/10\)/);
  if (usabilityMatch) scores.usability = parseFloat(usabilityMatch[1]) || 7.0;

  const accessibilityMatch = analysis.match(/Accessibility\s*\((\d+\.?\d+)\/10\)/);
  if (accessibilityMatch) scores.accessibility = parseFloat(accessibilityMatch[1]) || 7.0;

  const mobileMatch = analysis.match(/Mobile Responsiveness\s*\((\d+\.?\d+)\/10\)/);
  if (mobileMatch) scores.mobile = parseFloat(mobileMatch[1]) || 7.0;

  const contentMatch = analysis.match(/Content & Copy\s*\((\d+\.?\d+)\/10\)/);
  if (contentMatch) scores.content = parseFloat(contentMatch[1]) || 7.0;

  const conversionMatch = analysis.match(/Conversion Optimization\s*\((\d+\.?\d+)\/10\)/);
  if (conversionMatch) scores.conversion = parseFloat(conversionMatch[1]) || 7.0;

  const journeyMatch = analysis.match(/User Journey & Flow\s*\((\d+\.?\d+)\/10\)/);
  if (journeyMatch) scores.journey = parseFloat(journeyMatch[1]) || 7.0;

  // Extract grade
  const gradeMatch = analysis.match(/\*\*Grade:\*\*\s*([A+ABCDF-]+)/);
  const grade = gradeMatch ? gradeMatch[1] : 'B';

  // Extract classification
  const classificationMatch = analysis.match(/\*\*User Experience Classification:\*\*\s*([^\n]+)/);
  const classification = classificationMatch ? classificationMatch[1].trim() : 'Good';

  // Extract executive summary
  const executiveSummary = {
    keyStrengths: extractBulletPoints(analysis, '**Key Strengths:**'),
    criticalIssues: extractBulletPoints(analysis, '**Critical Issues:**'),
    quickWins: extractBulletPoints(analysis, '**Quick Wins:**'),
  };

  return {
    ...scores,
    grade,
    classification,
    executiveSummary,
  };
}

// Helper function to extract bullet points from analysis
function extractBulletPoints(analysis: string, sectionHeader: string): string[] {
  const sectionStart = analysis.indexOf(sectionHeader);
  if (sectionStart === -1) return [];
  
  const sectionEnd = analysis.indexOf('\n\n', sectionStart);
  const section = sectionEnd !== -1 ? analysis.substring(sectionStart, sectionEnd) : analysis.substring(sectionStart);
  
  const bulletPoints = section.match(/- ([^\n]+)/g) || [];
  return bulletPoints.map(point => point.replace('- ', '').trim()).filter(point => point.length > 0);
}

// Calculate grade from score
function calculateGrade(score: number): string {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7.0) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5.0) return 'D';
  return 'F';
}

// Calculate classification from score
function calculateClassification(score: number): string {
  if (score >= 9.0) return 'World-Class';
  if (score >= 8.0) return 'Professional';
  if (score >= 7.0) return 'Good';
  if (score >= 6.0) return 'Adequate';
  if (score >= 5.0) return 'Needs Improvement';
  return 'Critical';
}

// Main analysis function
export async function analyzeUX(request: UXAnalysisRequest): Promise<UXAnalysisResponse> {
  try {
    let images: string[] = [];
    let context = '';

    // Prepare images and context based on request type
    switch (request.type) {
      case 'domain':
        if (!request.domainUrl) {
          return {
            success: false,
            analysis: '',
            scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
            grade: 'F',
            classification: 'Critical',
            executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
            provider: 'openai',
            error: 'Domain URL is required for domain analysis',
          };
        }
        
        try {
          const screenshot = await captureWebsiteScreenshot(request.domainUrl);
          images.push(screenshot);
          context = `Website: ${request.domainUrl}`;
        } catch (error) {
          // If screenshot fails, analyze based on URL structure
          context = `Website URL: ${request.domainUrl} (Note: Could not capture screenshot, analyzing based on URL structure and best practices for this type of website)`;
        }
        break;

      case 'screenshots':
        if (!request.files || request.files.length === 0) {
          return {
            success: false,
            analysis: '',
            scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
            grade: 'F',
            classification: 'Critical',
            executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
            provider: 'openai',
            error: 'Screenshots are required for screenshot analysis',
          };
        }
        
        // Validate files
        for (const file of request.files) {
          const validation = validateImageFile(file);
          if (!validation.valid) {
            return {
              success: false,
              analysis: '',
              scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
              grade: 'F',
              classification: 'Critical',
              executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
              provider: 'openai',
              error: validation.error,
            };
          }
        }
        
        // Upload files and get URLs
        try {
          const fileUrls = await uploadMultipleImages(request.files);
          images.push(...fileUrls);
          context = `Analyzing ${request.files.length} screenshot(s) for UX evaluation`;
          console.log('Successfully uploaded images:', fileUrls);
        } catch (error) {
          console.error('Image upload failed:', error);
          // Fallback: analyze without images
          images = [];
          context = `Analyzing ${request.files.length} screenshot(s) (Note: Could not upload images, analyzing based on file information)`;
        }
        break;

      case 'figma':
        if (!request.figmaUrl) {
          return {
            success: false,
            analysis: '',
            scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
            grade: 'F',
            classification: 'Critical',
            executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
            provider: 'openai',
            error: 'Figma URL is required for Figma analysis',
          };
        }
        
        try {
          const screenshot = await captureFigmaScreenshot(request.figmaUrl);
          images.push(screenshot);
          context = `Figma Design: ${request.figmaUrl}`;
        } catch (error) {
          context = `Figma URL: ${request.figmaUrl} (Note: Could not capture Figma screenshot, analyzing based on URL structure and Figma design best practices)`;
        }
        break;

      default:
        return {
          success: false,
          analysis: '',
          scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
          grade: 'F',
          classification: 'Critical',
          executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
          provider: 'openai',
          error: 'Invalid analysis type',
        };
    }

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: UX_ANALYSIS_PROMPT,
      },
      {
        role: 'user',
        content: context,
      },
    ];

    // Add images if available
    if (images.length > 0) {
      const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = images.map(imageUrl => ({
        type: 'image_url',
        image_url: {
          url: imageUrl,
          detail: 'high',
        },
      }));

      messages[1] = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: context,
          },
          ...imageContent,
        ],
      };
    }

    // Call OpenAI API with retry logic
    let completion;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4o', // Latest GPT-4o model with vision capabilities
          messages,
          max_tokens: 4000,
          temperature: 0.7,
          response_format: {
            type: 'text',
          },
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        retryCount++;
        console.warn(`OpenAI API attempt ${retryCount} failed:`, error);
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }

    const analysis = completion?.choices?.[0]?.message?.content;
    
    if (!analysis) {
      throw new Error('No analysis generated');
    }

    // Extract scores and metadata from the analysis
    const analysisData = extractScoresFromAnalysis(analysis);

    return {
      success: true,
      analysis,
      scores: analysisData,
      grade: analysisData.grade,
      classification: analysisData.classification,
      executiveSummary: analysisData.executiveSummary,
      provider: 'openai',
    };

  } catch (error) {
    console.error('UX Analysis error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred during analysis';
    
    if (error instanceof Error) {
      if (error.message.includes('400') && error.message.includes('downloading')) {
        errorMessage = 'Failed to download images from storage. Please check your Supabase bucket permissions and public access settings.';
      } else if (error.message.includes('Invalid Compact JWS')) {
        errorMessage = 'Invalid Supabase configuration. Please check your service role key.';
      } else if (error.message.includes('bucket')) {
        errorMessage = 'Supabase bucket issue. Please ensure the design-uploads bucket exists and has proper permissions.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      analysis: '',
      scores: { overall: 0, visual: 0, navigation: 0, usability: 0, accessibility: 0, mobile: 0, content: 0, conversion: 0, journey: 0 },
      grade: 'F',
      classification: 'Critical',
      executiveSummary: { keyStrengths: [], criticalIssues: [], quickWins: [] },
      provider: 'openai',
      error: errorMessage,
    };
  }
}