import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const LEADS_DIR = join(process.cwd(), ".data");
const LEADS_FILE = join(LEADS_DIR, "leads.json");

function sanitize(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim().slice(0, 500);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[+]?[\d\s\-()]{7,20}$/.test(phone);
}

function persistLead(lead: Record<string, unknown>) {
  try {
    if (!existsSync(LEADS_DIR)) {
      mkdirSync(LEADS_DIR, { recursive: true });
    }

    let leads: Record<string, unknown>[] = [];
    if (existsSync(LEADS_FILE)) {
      try {
        leads = JSON.parse(readFileSync(LEADS_FILE, "utf-8"));
      } catch {
        leads = [];
      }
    }

    leads.push(lead);
    writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error("Failed to persist lead:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = sanitize(body.name || "");
    const phone = sanitize(body.phone || "");
    const email = sanitize(body.email || "");
    const employer = sanitize(body.employer || "");
    const salaryRange = sanitize(body.salaryRange || "");
    const desiredAmount = Number(body.desiredAmount) || 0;
    const tenure = sanitize(body.tenure || "");

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    if (desiredAmount < 5000 || desiredAmount > 5000000) {
      return NextResponse.json(
        { success: false, error: "Loan amount must be between AED 5,000 and AED 5,000,000." },
        { status: 400 }
      );
    }

    const referenceId = `ML-${Date.now().toString(36).toUpperCase()}`;
    const lead = {
      referenceId,
      name,
      phone,
      email,
      employer,
      salaryRange,
      desiredAmount,
      tenure,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    // Persist to file (survives server restarts)
    persistLead(lead);

    console.log("=== NEW LOAN LEAD ===");
    console.log(JSON.stringify(lead, null, 2));
    console.log("====================");

    return NextResponse.json({
      success: true,
      message: "Thank you! A personal loan specialist will contact you within 24 hours.",
      referenceId,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
