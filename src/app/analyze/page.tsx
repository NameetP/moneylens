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
        setErrorMsg(
          "Only PDF files are supported. Please upload a .pdf statement."
        );
        setState("error");
        return;
      }
      setFileName(file.name);
      setErrorMsg("");
      setState("uploading");

      await new Promise((r) => setTimeout(r, 400));
      setState("processing");
      setProcessingStep(0);

      // Animate through processing steps
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
          setErrorMsg(
            data.error ||
              "Could not parse your statement. Please try a different file."
          );
          setState("error");
        }
      } catch {
        clearInterval(stepInterval);
        setErrorMsg(
          "Something went wrong. Please try again or use sample data."
        );
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full border-b border-[#e5e5e5]">
        <Logo />
        <div className="flex items-center gap-4">
          <TrustBadge />
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 tracking-[-0.02em] text-[#0a0a0a]">
            Upload your credit card statement
          </h1>
          <p className="text-[#737373] text-center mb-8">
            Drop your PDF statement below. We&apos;ll analyze it in seconds.
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
                ? "border-[#059669] bg-[#ecfdf5]"
                : state === "error"
                ? "border-[#fca5a5] bg-[#fef2f2]"
                : state === "idle"
                ? "border-[#d4d4d4] hover:border-[#a3a3a3] bg-white"
                : "border-[#d4d4d4] bg-white"
            } shadow-sm`}
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
                  <div className="w-14 h-14 rounded-2xl bg-[#f5f5f4] flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#737373]" />
                  </div>
                  <p className="text-sm text-[#525252] mb-1">
                    <span className="hidden sm:inline">Drag & drop your PDF statement here</span>
                    <span className="sm:hidden">Tap to upload your PDF statement</span>
                  </p>
                  <p className="text-xs text-[#a3a3a3]">
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
                  <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-[#dc2626]" />
                  </div>
                  <p className="text-sm text-[#dc2626] font-medium mb-1">
                    Upload failed
                  </p>
                  <p className="text-xs text-[#737373] max-w-xs">{errorMsg}</p>
                  <p className="text-xs text-[#a3a3a3] mt-2">
                    Click to try again
                  </p>
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
                  <FileText className="w-8 h-8 text-[#525252] mb-3" />
                  <p className="text-sm text-[#0a0a0a] mb-1">{fileName}</p>
                  <p className="text-xs text-[#737373]">Uploading securely...</p>
                  <div className="w-48 h-1 bg-[#e5e5e5] rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#059669] rounded-full"
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
                  <Loader2 className="w-8 h-8 text-[#059669] animate-spin mb-4" />
                  <div className="space-y-2 w-full max-w-xs">
                    {processingSteps.map((step, i) => (
                      <div
                        key={step.label}
                        className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                          i < processingStep
                            ? "text-[#059669]"
                            : i === processingStep
                            ? "text-[#0a0a0a] font-medium"
                            : "text-[#d4d4d4]"
                        }`}
                      >
                        {i < processingStep ? (
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        ) : i === processingStep ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#059669] border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#e5e5e5] shrink-0" />
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
                  <CheckCircle className="w-8 h-8 text-[#059669] mb-3" />
                  <p className="text-sm text-[#0a0a0a]">Analysis complete!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo mode button */}
          {(state === "idle" || state === "error") && (
            <button
              onClick={handleDemoUpload}
              className="mt-4 w-full text-center text-xs text-[#a3a3a3] hover:text-[#059669] transition-colors py-2"
            >
              No PDF handy?{" "}
              <span className="underline">Try with sample data →</span>
            </button>
          )}

          {/* What we see — transparency */}
          <div className="mt-8 p-4 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">
            <p className="text-xs font-medium text-[#525252] mb-3">What happens to your data</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <p className="text-[10px] text-[#737373] leading-tight">Encrypted upload</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <p className="text-[10px] text-[#737373] leading-tight">We read amounts &amp; merchants only</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <p className="text-[10px] text-[#737373] leading-tight">Deleted after processing</p>
              </div>
            </div>
          </div>

          {/* What we DON'T see */}
          <div className="mt-3 flex items-center gap-2 justify-center">
            <Shield className="w-3 h-3 text-[#a3a3a3]" />
            <p className="text-[10px] text-[#a3a3a3]">
              We never see your card number, account number, or personal details
            </p>
          </div>

          {/* Supported Banks */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#a3a3a3] mb-3">Supported banks</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] font-medium">
                Emirates NBD
              </span>
              {comingSoonBanks.map((bank) => (
                <span
                  key={bank}
                  className="px-3 py-1 text-xs rounded-full bg-[#f5f5f4] border border-[#e5e5e5] text-[#a3a3a3]"
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
