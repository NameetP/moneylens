"use client";

import { useState, useCallback } from "react";
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

  const handleFile = useCallback(
    async (file: File) => {
      if (!file || !file.name.endsWith(".pdf")) return;
      setFileName(file.name);
      setState("uploading");

      // Simulate upload
      await new Promise((r) => setTimeout(r, 800));
      setState("processing");

      // Call mock API
      try {
        const res = await fetch("/api/parse-statement", {
          method: "POST",
          body: new FormData(),
        });
        const data = await res.json();

        if (data.success) {
          // Store in sessionStorage for results page
          sessionStorage.setItem("statementData", JSON.stringify(data.data));
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
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Logo />
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
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
          <h1 className="text-3xl font-bold text-center mb-2">
            Upload your credit card statement
          </h1>
          <p className="text-zinc-500 text-center mb-8">
            Drop your PDF statement below. We&apos;ll analyze it in seconds.
          </p>

          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-[#22c55e] bg-[#22c55e]/5"
                : state === "idle"
                ? "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30"
                : "border-zinc-800 bg-zinc-900/30"
            }`}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={state === "idle" ? handleDemoUpload : undefined}
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
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-sm text-zinc-400 mb-1">
                    Drag & drop your PDF statement here
                  </p>
                  <p className="text-xs text-zinc-600">
                    or click to select (demo mode — uses sample data)
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
                  <FileText className="w-8 h-8 text-zinc-400 mb-3" />
                  <p className="text-sm text-white mb-1">{fileName}</p>
                  <p className="text-xs text-zinc-500">Uploading...</p>
                  <div className="w-48 h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#22c55e] rounded-full"
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
                  <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin mb-3" />
                  <p className="text-sm text-white mb-1">
                    Analyzing your statement...
                  </p>
                  <p className="text-xs text-zinc-500">
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
                  <CheckCircle className="w-8 h-8 text-[#22c55e] mb-3" />
                  <p className="text-sm text-white">Analysis complete!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supported Banks */}
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 mb-3">Supported banks</p>
            <div className="flex flex-wrap justify-center gap-2">
              {supportedBanks.map((bank) => (
                <span
                  key={bank}
                  className="px-3 py-1 text-xs rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500"
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
