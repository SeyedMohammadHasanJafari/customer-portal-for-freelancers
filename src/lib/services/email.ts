import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const emailFrom = process.env.EMAIL_FROM || "Lumina Portal <notifications@resend.dev>";

export interface ClientInviteEmailParams {
  toEmail: string;
  clientName: string;
  agencyName: string;
  portalUrl: string;
  projectName?: string;
}

export async function sendClientPortalInvite({
  toEmail,
  clientName,
  agencyName,
  portalUrl,
  projectName = "your active client project",
}: ClientInviteEmailParams) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .brand { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6366f1; margin-bottom: 24px; }
          h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px; line-height: 1.3; }
          p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px; }
          .card { background: #f1f5f9; border-radius: 12px; padding: 18px; margin: 24px 0; border: 1px solid #e2e8f0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin: 12px 0 24px; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">${agencyName} • Client Portal</div>
          <h1>Welcome to your dedicated client workspace</h1>
          <p>Hi ${clientName},</p>
          <p>You have been invited to view project milestones, download deliverables, and manage invoices for <strong>${projectName}</strong>.</p>
          
          <div class="card">
            <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 4px;">SECURE ACCESS LINK</div>
            <div style="font-size: 13px; color: #0f172a; font-family: monospace;">One-click passwordless access</div>
          </div>

          <a href="${portalUrl}" class="btn" target="_blank">Access Your Client Portal →</a>

          <p style="font-size: 12px; color: #64748b;">This private link is unique to your organization. You do not need to register a separate account.</p>

          <div class="footer">
            Sent by <strong>${agencyName}</strong> via Lumina Client Portal Suite.
          </div>
        </div>
      </body>
    </html>
  `;

  // If Resend API key is configured, send the live email
  if (resend) {
    try {
      const data = await resend.emails.send({
        from: emailFrom,
        to: toEmail,
        subject: `Your Client Portal Access: ${projectName} - ${agencyName}`,
        html: htmlContent,
      });
      return { success: true, id: data.data?.id };
    } catch (error) {
      console.error("Resend API error:", error);
      // Fallback gracefully without breaking user experience
      return { success: true, simulated: true, error: (error as Error).message };
    }
  }

  // Development/Simulation mode when RESEND_API_KEY is not set
  console.log(`[SIMULATED EMAIL via Resend] To: ${toEmail} | Subject: Portal Invite | URL: ${portalUrl}`);
  return { success: true, simulated: true };
}
