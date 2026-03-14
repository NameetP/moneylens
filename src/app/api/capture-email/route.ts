import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { sendSpendingSummary } from "@/lib/email";

const DATA_DIR = ".data";
const EMAILS_FILE = `${DATA_DIR}/emails.json`;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.replace(/[<>&"'/\\]/g, "").trim().slice(0, 200);
}

interface EmailEntry {
  email: string;
  monthlyReminder: boolean;
  context: Record<string, unknown>;
  capturedAt: string;
  source: string;
  emailSent?: boolean;
}

function persistEmail(entry: EmailEntry) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  let emails: EmailEntry[] = [];
  if (existsSync(EMAILS_FILE)) {
    try {
      emails = JSON.parse(readFileSync(EMAILS_FILE, "utf-8"));
    } catch {
      emails = [];
    }
  }

  // Deduplicate by email — update existing entry
  const existingIdx = emails.findIndex((e) => e.email === entry.email);
  if (existingIdx >= 0) {
    emails[existingIdx] = { ...emails[existingIdx], ...entry };
  } else {
    emails.push(entry);
  }

  writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitize(body.email || "");

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required." },
        { status: 400 }
      );
    }

    const entry: EmailEntry = {
      email,
      monthlyReminder: Boolean(body.monthlyReminder),
      context: body.context || {},
      capturedAt: new Date().toISOString(),
      source: "post-analysis",
    };

    // Always persist the email first
    persistEmail(entry);

    // Send the actual spending summary email
    const categories = body.categories || [];
    const totalSpend = body.totalSpend || body.context?.totalSpend || 0;

    if (categories.length > 0) {
      const emailResult = await sendSpendingSummary({
        email,
        totalSpend,
        categories,
        bankName: body.bankName,
        cardType: body.cardType,
        statementPeriod: body.statementPeriod,
      });

      if (emailResult.success) {
        // Update the persisted entry to track that email was sent
        persistEmail({ ...entry, emailSent: true });
      } else {
        console.warn(`Email send failed for ${email}: ${emailResult.error}`);
        // Don't fail the request — email is captured for retry
      }

      return NextResponse.json({
        success: true,
        emailSent: emailResult.success,
      });
    }

    return NextResponse.json({ success: true, emailSent: false });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
