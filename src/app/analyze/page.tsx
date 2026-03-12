"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const supportedBanks = [
  "Emirates NBD",
  "ADCB",
  "FAB",
  "HSBC",
  "Mashreq",
  "DIB",
  "RAK Bank",
  "CBD",
  "Standard Chartered",
];

type UploadState = "idle" | "uploading" | "processing" | "done";

export default function AnalyzePage() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file || !file.name.endsWith(".pdf")) return;
      setFileName(file.name);
      setState("uploading");

      await new Promise((r) => setTimeout(r, 400));
      setState("processing");

      // Send real file to PDFMux-powered API
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-statement", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          // Store in sessionStorage for results page
          sessionStorage.setItem("statementData", JSON.stringify(data.data));
          if (data.warning) {
            sessionStorage.setItem("parseWarning", data.warning);
          }
          sessionStorage.setItem("parseSource", data.source || "unknown");
          setState("done");
          await new Promise((r) => setTimeout(r, 600));
          router.push("/results");
        }
      } catch {
        setState("idle");
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

  // For demo: clicking the zone triggers upload with mock PDF
  const handleDemoUpload = useCallback(() => {
    const mockFile = new File(["demo"], "statement-feb-2026.pdf", {
      type: "application/pdf",
    });
    handleFile(mockFile);
  }, [handleFile]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full border-b border-gray-100">
        <Logo />
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
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
                : state === "idle"
                ? "border-[#d4d4d4] hover:border-[#a3a3a3] bg-white"
                : "border-[#d4d4d4] bg-white"
            } shadow-sm`}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={state === "idle" ? () => fileInputRef.current?.click() : undefined}
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
                    Drag & drop your PDF statement here
                  </p>
                  <p className="text-xs text-[#a3a3a3]">
                    or click to browse your files
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
                  <p className="text-xs text-[#737373]">Uploading...</p>
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
                  <Loader2 className="w-8 h-8 text-[#059669] animate-spin mb-3" />
                  <p className="text-sm text-[#0a0a0a] mb-1">
                    Analyzing your statement...
                  </p>
                  <p className="text-xs text-[#737373]">
                    Categorizing transactions & matching cards
                  </p>
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
          {state === "idle" && (
            <button
              onClick={handleDemoUpload}
              className="mt-4 w-full text-center text-xs text-[#a3a3a3] hover:text-[#059669] transition-colors py-2"
            >
              No PDF handy? <span className="underline">Try with sample data →</span>
            </button>
          )}

          {/* Supported Banks */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#a3a3a3] mb-3">Supported banks</p>
            <div className="flex flex-wrap justify-center gap-2">
              {supportedBanks.map((bank) => (
                <span
                  key={bank}
                  className="px-3 py-1 text-xs rounded-full bg-[#f5f5f4] border border-[#e5e5e5] text-[#737373]"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
