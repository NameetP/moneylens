"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Lock,
  Eye,
  Trash2,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustBadge } from "@/components/TrustBadge";
import { Footer } from "@/components/Footer";

const comingSoonBanks = [
  "ADCB",
  "FAB",
  "HSBC",
  "Mashreq",
  "DIB",
  "RAK Bank",
  "CBD",
  "Standard Chartered",
];

type UploadState = "idle" | "uploading" | "processing" | "done" | "error";

const processingSteps = [
  { label: "Reading PDF..." },
  { label: "Extracting transactions..." },
  { label: "Categorizing spending..." },
  { label: "Matching cards..." },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("Only PDF files are supported. Please upload a .pdf statement.");
        setState("error");
        return;
      }
      setFileName(file.name);
      setErrorMsg("");
      setState("uploading");

      await new Promise((r) => setTimeout(r, 400));
      setState("processing");
      setProcessingStep(0);

      const stepInterval = setInterval(() => {
        setProcessingStep((s) => {
          if (s < processingSteps.length - 1) return s + 1;
          clearInterval(stepInterval);
          return s;
        });
      }, 800);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-statement", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        clearInterval(stepInterval);

        if (data.success) {
          sessionStorage.setItem("statementData", JSON.stringify(data.data));
          if (data.warning) {
            sessionStorage.setItem("parseWarning", data.warning);
          }
          sessionStorage.setItem("parseSource", data.source || "unknown");
          setState("done");
          await new Promise((r) => setTimeout(r, 600));
          router.push("/results");
        } else {
          setErrorMsg(data.error || "Could not parse your statement. Please try a different file.");
          setState("error");
        }
      } catch {
        clearInterval(stepInterval);
        setErrorMsg("Something went wrong. Please try again or use sample data.");
        setState("error");
      }
    },
    [router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDemoUpload = useCallback(() => {
    const mockFile = new File(["demo"], "statement-feb-2026.pdf", {
      type: "application/pdf",
    });
    handleFile(mockFile);
  }, [handleFile]);

  const resetToIdle = () => {
    setState("idle");
    setErrorMsg("");
    setFileName("");
    setProcessingStep(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-[#E4E4E7]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-4">
            <TrustBadge />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-[#52525B] hover:text-[#18181B] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-3xl font-extrabold text-center mb-2 tracking-[-0.03em] text-[#18181B]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Upload your statement
          </h1>
          <p className="text-[#71717A] text-center mb-8 text-sm">
            Drop your credit card PDF below. We&apos;ll analyze it in seconds.
          </p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-[#0A6E3F] bg-[#ECFDF5]"
                : state === "error"
                ? "border-[#FCA5A5] bg-[#FEF2F2]"
                : state === "idle"
                ? "border-[#E4E4E7] hover:border-[#0A6E3F] hover:bg-[#FAFAFA] bg-white"
                : "border-[#E4E4E7] bg-white"
            }`}
            style={{ boxShadow: dragActive ? "0 0 0 4px rgba(10, 110, 63, 0.1)" : "var(--shadow-xs)" }}
            role="button"
            tabIndex={0}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={
              state === "idle" || state === "error"
                ? () => {
                    if (state === "error") resetToIdle();
                    fileInputRef.current?.click();
                  }
                : undefined
            }
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                (state === "idle" || state === "error")
              ) {
                e.preventDefault();
                if (state === "error") resetToIdle();
                fileInputRef.current?.click();
              }
            }}
          >
            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#0A6E3F]" />
                  </div>
                  <p className="text-sm font-medium text-[#18181B] mb-1">
                    <span className="hidden sm:inline">Drag & drop your PDF statement here</span>
                    <span className="sm:hidden">Tap to upload your PDF statement</span>
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    <span className="hidden sm:inline">or click to browse your files</span>
                    <span className="sm:hidden">Select from your files or downloads</span>
                  </p>
                </motion.div>
              )}

              {state === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-[#DC2626]" />
                  </div>
                  <p className="text-sm text-[#DC2626] font-semibold mb-1">Upload failed</p>
                  <p className="text-xs text-[#71717A] max-w-xs">{errorMsg}</p>
                  <p className="text-xs text-[#A1A1AA] mt-2">Click to try again</p>
                </motion.div>
              )}

              {state === "uploading" && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <FileText className="w-8 h-8 text-[#52525B] mb-3" />
                  <p className="text-sm font-medium text-[#18181B] mb-1">{fileName}</p>
                  <p className="text-xs text-[#71717A]">Uploading securely...</p>
                  <div className="w-48 h-1.5 bg-[#F4F4F5] rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0A6E3F] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              )}

              {state === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 className="w-8 h-8 text-[#0A6E3F] animate-spin mb-4" />
                  <div className="space-y-2.5 w-full max-w-xs">
                    {processingSteps.map((step, i) => (
                      <div
                        key={step.label}
                        className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                          i < processingStep
                            ? "text-[#0A6E3F]"
                            : i === processingStep
                            ? "text-[#18181B] font-medium"
                            : "text-[#D4D4D8]"
                        }`}
                      >
                        {i < processingStep ? (
                          <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : i === processingStep ? (
                          <div className="w-4 h-4 border-2 border-[#0A6E3F] border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#E4E4E7] shrink-0" />
                        )}
                        {step.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {state === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle className="w-8 h-8 text-[#0A6E3F] mb-3" />
                  <p className="text-sm font-semibold text-[#18181B]">Analysis complete!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo mode button */}
          {(state === "idle" || state === "error") && (
            <button
              onClick={handleDemoUpload}
              className="mt-4 w-full text-center text-sm font-medium text-[#0A6E3F] hover:text-[#085C34] transition-colors py-2.5 rounded-xl hover:bg-[#ECFDF5]"
            >
              No PDF handy? <span className="underline underline-offset-2">Try with sample data →</span>
            </button>
          )}

          {/* What happens to your data */}
          <div className="mt-8 p-5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <p className="text-xs font-semibold text-[#52525B] mb-4">What happens to your data</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Lock, label: "Encrypted upload" },
                { icon: Eye, label: "Amounts & merchants only" },
                { icon: Trash2, label: "Deleted after processing" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <item.icon className="w-4 h-4 text-[#0A6E3F]" />
                  </div>
                  <p className="text-[10px] text-[#71717A] leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What we DON'T see */}
          <div className="mt-3 flex items-center gap-2 justify-center">
            <Shield className="w-3 h-3 text-[#A1A1AA]" />
            <p className="text-[10px] text-[#A1A1AA]">
              We never see your card number, account number, or personal details
            </p>
          </div>

          {/* Supported Banks */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#A1A1AA] mb-3 font-medium">Supported banks</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1.5 text-xs rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#0A6E3F] font-semibold">
                Emirates NBD
              </span>
              {comingSoonBanks.map((bank) => (
                <span
                  key={bank}
                  className="px-3 py-1.5 text-xs rounded-full bg-[#FAFAFA] border border-[#E4E4E7] text-[#A1A1AA]"
                >
                  {bank}
                  <span className="ml-1 text-[10px]">soon</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
