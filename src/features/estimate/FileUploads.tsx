"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  UploadSimpleIcon,
  FilePdfIcon,
  ImageIcon,
  TrashIcon,
  SpinnerGapIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import { FILE_CATEGORIES, UPLOAD_LIMITS, type FileCategory } from "./options";
import type { UploadedFile } from "./schema";
import { publicEnv, uploadsEnabled } from "@/lib/public-env";
import { cx } from "@/lib/utils";

type Item = {
  key: string;
  name: string;
  category: FileCategory;
  size: number;
  status: "uploading" | "done" | "error";
  error?: string;
  preview?: string;
  uploaded?: UploadedFile;
};

let browserClient: SupabaseClient | null = null;
const storage = () => {
  browserClient ??= createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: { persistSession: false },
  });
  return browserClient.storage.from("quote-uploads");
};

/** Some browsers report HEIC/HEIF with an empty type — infer it from the extension. */
const fileType = (f: File) => {
  if (f.type) return f.type;
  const ext = f.name.split(".").pop()?.toLowerCase();
  return ext === "heic" ? "image/heic" : ext === "heif" ? "image/heif" : ext === "pdf" ? "application/pdf" : "";
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function FileUploads({
  sessionId,
  files,
  onChange,
  onBusyChange,
}: {
  sessionId: string;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    files.map((f) => ({ key: f.path, name: f.name, category: f.category, size: f.size, status: "done", uploaded: f })),
  );
  const [notice, setNotice] = useState("");
  const previews = useRef<string[]>([]);

  // Report finished uploads and busy state to the questionnaire.
  useEffect(() => {
    onChange(items.flatMap((i) => (i.status === "done" && i.uploaded ? [i.uploaded] : [])));
    onBusyChange(items.some((i) => i.status === "uploading"));
  }, [items, onChange, onBusyChange]);

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const update = (key: string, patch: Partial<Item>) =>
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  async function addFiles(category: FileCategory, list: FileList | null) {
    if (!list?.length) return;
    setNotice("");
    const room = UPLOAD_LIMITS.maxFiles - items.length;
    const picked = Array.from(list).slice(0, Math.max(0, room));
    if (list.length > picked.length) setNotice(`You can upload up to ${UPLOAD_LIMITS.maxFiles} files in total.`);

    const accepted: { file: File; type: string; item: Item }[] = [];
    const rejected: Item[] = [];
    for (const file of picked) {
      const type = fileType(file);
      const base = { key: crypto.randomUUID(), name: file.name, category, size: file.size };
      if (!UPLOAD_LIMITS.mimeTypes.includes(type)) {
        rejected.push({ ...base, status: "error", error: "Only JPG, PNG, WEBP, HEIC or PDF files." });
      } else if (file.size > UPLOAD_LIMITS.maxBytes) {
        rejected.push({ ...base, status: "error", error: "This file is larger than 15 MB." });
      } else {
        const preview = type.startsWith("image/") && !type.includes("hei") ? URL.createObjectURL(file) : undefined;
        if (preview) previews.current.push(preview);
        accepted.push({ file, type, item: { ...base, status: "uploading", preview } });
      }
    }
    setItems((list) => [...list, ...accepted.map((a) => a.item), ...rejected]);
    if (!accepted.length) return;

    try {
      const res = await fetch("/api/estimates/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadSessionId: sessionId,
          files: accepted.map((a) => ({ name: a.file.name, type: a.type, size: a.file.size })),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed.");

      await Promise.all(
        accepted.map(async (a, i) => {
          const { path, token } = body.uploads[i] as { path: string; token: string };
          const { error } = await storage().uploadToSignedUrl(path, token, a.file, { contentType: a.type });
          if (error) {
            update(a.item.key, { status: "error", error: "Upload failed — please try again." });
          } else {
            update(a.item.key, {
              status: "done",
              uploaded: { path, name: a.file.name, category, contentType: a.type, size: a.file.size },
            });
          }
        }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      accepted.forEach((a) => update(a.item.key, { status: "error", error: message }));
    }
  }

  if (!uploadsEnabled()) {
    return (
      <p className="border-l-4 border-highlight bg-surface p-4 text-sm leading-relaxed text-ink">
        Online photo uploads aren&apos;t switched on yet. You can skip this step — we&apos;ll ask for photos when we
        contact you.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Optional, but photos help us give a more accurate estimate. JPG, PNG, WEBP, HEIC or PDF, up to 15 MB each
        ({UPLOAD_LIMITS.maxFiles} files max).
      </p>

      {FILE_CATEGORIES.map((cat) => {
        const inputId = `upload-${cat.value}`;
        const catItems = items.filter((i) => i.category === cat.value);
        return (
          <section key={cat.value} aria-labelledby={`${inputId}-label`} className="border border-line p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 id={`${inputId}-label`} className="font-semibold text-ink">
                  {cat.label}
                </h3>
                <p className="text-sm text-muted">{cat.hint}</p>
              </div>
              <label
                htmlFor={inputId}
                className="eyebrow inline-flex min-h-11 cursor-pointer items-center gap-2 border border-ink px-4 text-ink transition-colors hover:bg-ink hover:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
              >
                <UploadSimpleIcon size={16} weight="bold" aria-hidden="true" />
                Add files
                <input
                  id={inputId}
                  type="file"
                  multiple
                  accept={UPLOAD_LIMITS.accept}
                  className="sr-only"
                  aria-label={`Add files: ${cat.label}`}
                  onChange={(e) => {
                    addFiles(cat.value, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {catItems.length > 0 && (
              <ul className="mt-4 space-y-2">
                {catItems.map((item) => (
                  <li key={item.key} className="flex items-center gap-3 bg-surface p-2 pr-1">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-paper text-muted">
                      {item.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                        <img src={item.preview} alt="" className="h-full w-full object-cover" />
                      ) : item.name.toLowerCase().endsWith(".pdf") ? (
                        <FilePdfIcon size={24} aria-hidden="true" />
                      ) : (
                        <ImageIcon size={24} aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink" title={item.name}>
                        {item.name}
                      </span>
                      <span
                        className={cx(
                          "flex items-center gap-1.5 text-xs",
                          item.status === "error" ? "text-danger" : "text-muted",
                        )}
                        aria-live="polite"
                      >
                        {item.status === "uploading" && (
                          <>
                            <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" /> Uploading…
                          </>
                        )}
                        {item.status === "done" && (
                          <>
                            <CheckCircleIcon size={14} className="text-success" aria-hidden="true" /> Uploaded ·{" "}
                            {formatSize(item.size)}
                          </>
                        )}
                        {item.status === "error" && (
                          <>
                            <WarningCircleIcon size={14} aria-hidden="true" /> {item.error}
                          </>
                        )}
                      </span>
                    </span>
                    <button
                      type="button"
                      disabled={item.status === "uploading"}
                      onClick={() => setItems((list) => list.filter((i) => i.key !== item.key))}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-muted hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Remove ${item.name}`}
                    >
                      <TrashIcon size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {notice && (
        <p role="status" className="text-sm text-danger">
          {notice}
        </p>
      )}
    </div>
  );
}
