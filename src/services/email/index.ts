import { env } from "@/config/env";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send an email via Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
    if (!env.RESEND_API_KEY) {
        console.log("[Email Mock]", options.subject, "→", options.to);
        return;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: "CritiqUX <noreply@critiqux.com>",
            to: options.to,
            subject: options.subject,
            html: options.html,
        }),
    });

    if (!response.ok) {
        console.error("Failed to send email:", await response.text());
    }
}

/**
 * Send a team invitation email
 */
export async function sendInvitationEmail(
    email: string,
    projectName: string,
    inviterName: string
): Promise<void> {
    await sendEmail({
        to: email,
        subject: `You've been invited to "${projectName}" on CritiqUX`,
        html: `
      <h2>You've been invited!</h2>
      <p>${inviterName} has invited you to collaborate on "${projectName}" in CritiqUX.</p>
      <a href="${env.NEXT_PUBLIC_APP_URL}/login" style="
        display: inline-block;
        padding: 12px 24px;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
      ">Accept Invitation</a>
    `,
    });
}

/**
 * Send a feedback request email
 */
export async function sendFeedbackRequestEmail(
    email: string,
    projectName: string,
    feedbackUrl: string
): Promise<void> {
    await sendEmail({
        to: email,
        subject: `Feedback requested for "${projectName}"`,
        html: `
      <h2>Your feedback is needed!</h2>
      <p>A designer has requested your feedback on "${projectName}".</p>
      <a href="${feedbackUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
      ">Give Feedback</a>
    `,
    });
}
