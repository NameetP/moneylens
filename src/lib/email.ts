/**
 * Email Service — Brevo integration for MoneyLens
 *
 * Sends beautifully formatted spending summary emails.
 * Uses Brevo REST API directly (no SDK dependency).
 * Free tier: 300 emails/day.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
// TODO: switch to summary@moneylens.app once SPF/DKIM records are verified
const FROM_EMAIL = "coldbrew856@gmail.com";
const FROM_NAME = "MoneyLens";

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SpendingSummaryData {
  email: string;
  totalSpend: number;
  categories: CategoryData[];
  bankName?: string;
  cardType?: string;
  statementPeriod?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  Dining: "🍽️",
  Groceries: "🛒",
  Shopping: "🛍️",
  Transport: "🚗",
  Travel: "✈️",
  Subscriptions: "📱",
  Entertainment: "🎬",
  Health: "💊",
  Utilities: "💡",
  "Everything Else": "📦",
  Other: "📦",
};

function buildCategoryRows(categories: CategoryData[]): string {
  return categories
    .filter((c) => c.amount > 0)
    .map((c) => {
      const icon = CATEGORY_ICONS[c.name] || "📦";
      const barWidth = Math.max(Math.min(c.percentage, 100), 5);
      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #F5F0EB;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-size: 14px; color: #1C1917; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                  ${icon} ${c.name}
                </td>
                <td align="right" style="font-size: 14px; font-weight: 600; color: #1C1917; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                  AED ${c.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </td>
                <td align="right" width="60" style="font-size: 12px; color: #78716C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                  ${c.percentage.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td colspan="3" style="padding-top: 6px;">
                  <div style="background: #F5F0EB; border-radius: 4px; height: 6px; width: 100%;">
                    <div style="background: ${c.color || "#C2410C"}; border-radius: 4px; height: 6px; width: ${barWidth}%;"></div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join("");
}

function buildEmailHtml(data: SpendingSummaryData): string {
  const topCategory = data.categories[0];
  const categoryRows = buildCategoryRows(data.categories);
  const statementInfo = data.bankName
    ? `${data.bankName}${data.cardType ? ` ${data.cardType}` : ""}${data.statementPeriod ? ` · ${data.statementPeriod}` : ""}`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FAF7F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 24px; font-weight: 700; color: #1C1917; letter-spacing: -0.5px;">
                💳 MoneyLens
              </span>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background: #FFFFFF; border-radius: 20px; padding: 36px; border: 1px solid #E7E5E4;">

              <!-- Headline -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size: 22px; font-weight: 700; color: #1C1917; padding-bottom: 4px;">
                    Your Spending Summary
                  </td>
                </tr>
                ${statementInfo ? `
                <tr>
                  <td style="font-size: 13px; color: #78716C; padding-bottom: 20px;">
                    ${statementInfo}
                  </td>
                </tr>
                ` : ""}
              </table>

              <!-- Total spend -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FFF7ED; border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9A3412; font-weight: 600;">
                      Total Spent
                    </span>
                    <br>
                    <span style="font-size: 32px; font-weight: 800; color: #C2410C; letter-spacing: -1px;">
                      AED ${data.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </td>
                  ${topCategory ? `
                  <td align="right" style="padding: 20px 24px;">
                    <span style="font-size: 12px; color: #78716C;">Top category</span>
                    <br>
                    <span style="font-size: 16px; font-weight: 600; color: #1C1917;">
                      ${CATEGORY_ICONS[topCategory.name] || "📦"} ${topCategory.name}
                    </span>
                    <br>
                    <span style="font-size: 13px; color: #78716C;">
                      AED ${topCategory.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (${topCategory.percentage.toFixed(1)}%)
                    </span>
                  </td>
                  ` : ""}
                </tr>
              </table>

              <!-- Category breakdown -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size: 14px; font-weight: 600; color: #57534E; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Breakdown by Category
                  </td>
                </tr>
                ${categoryRows}
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    <a href="https://staging-moneylens.aidispatch.xyz/analyze"
                       style="display: inline-block; background: #C2410C; color: #FFFFFF; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 600;">
                      Analyze Another Statement →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px; font-size: 12px; color: #A8A29E;">
                    Upload a new statement to see updated recommendations
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 28px 0 0;">
              <span style="font-size: 11px; color: #A8A29E;">
                MoneyLens · Your money, decoded.
                <br>
                You received this because you requested a spending summary.
                <br>
                We never share your data. No spam, ever.
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Brevo Send ─────────────────────────────────────────────

async function brevoSend(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Email] BREVO_API_KEY not set, skipping send");
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        tags: ["moneylens-spending-summary"],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Email] Brevo error:", data);
      return { success: false, error: data.message || `HTTP ${res.status}` };
    }

    console.log(`[Email] Sent spending summary to ${to} (messageId: ${data.messageId})`);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("[Email] Network error:", err);
    return { success: false, error: String(err) };
  }
}

// ── Public API ─────────────────────────────────────────────

export async function sendSpendingSummary(
  data: SpendingSummaryData
): Promise<{ success: boolean; error?: string }> {
  const html = buildEmailHtml(data);
  return brevoSend(data.email, "Your MoneyLens Spending Summary", html);
}
