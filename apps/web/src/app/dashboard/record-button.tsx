"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  MOOD_EMOJI,
  MOOD_LABELS,
  PRIORITY_COLOR,
  type ExtractionResult,
  type RecordResponse,
} from "@acuity/shared";

type Phase =
  | "idle"
  | "recording"
  | "uploading"
  | "transcribing"
  | "extracting"
  | "done"
  | "error";

const MAX_SECONDS = 120;

const PHASE_LABEL: Partial<Record<Phase, string>> = {
  uploading: "Uploading audio...",
  transcribing: "Transcribing with Whisper...",
  extracting: "Extracting insights with Claude...",
};

export function RecordButton() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecordResponse | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setElapsed(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: bestMimeType() });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const baseMime = mr.mimeType.split(";")[0] || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: baseMime });
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        upload(blob, duration, baseMime);
      };

      mr.start(1000);
      startTimeRef.current = Date.now();
      setPhase("recording");

      timerRef.current = setInterval(() => {
        const secs = Math.round((Date.now() - startTimeRef.current) / 1000);
        setElapsed(secs);
        if (secs >= MAX_SECONDS) stopRecording();
      }, 500);
    } catch {
      setError("Microphone access denied. Check your browser permissions.");
      setPhase("error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const upload = async (blob: Blob, duration: number, mime: string) => {
    setPhase("uploading");

    const fd = new FormData();
    fd.append("audio", blob, `recording.${extFromMime(mime)}`);
    fd.append("durationSeconds", String(duration));

    const t1 = setTimeout(() => setPhase("transcribing"), 2000);
    const t2 = setTimeout(() => setPhase("extracting"), 8000);

    try {
      const res = await fetch("/api/record", { method: "POST", body: fd });
      clearTimeout(t1);
      clearTimeout(t2);

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      setResult(body as RecordResponse);
      setPhase("done");
      router.refresh();
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      setError(err instanceof Error ? err.message : "Upload failed");
      setPhase("error");
    }
  };

  const handleClick = async () => {
    if (phase === "recording") return stopRecording();
    if (["idle", "done", "error"].includes(phase)) return startRecording();
  };

  const isProcessing = ["uploading", "transcribing", "extracting"].includes(
    phase
  );
  const progressPercent =
    phase === "uploading" ? 20 : phase === "transcribing" ? 55 : phase === "extracting" ? 85 : 0;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
        {/* Mic button */}
        <button
          onClick={handleClick}
          disabled={isProcessing}
          aria-label={phase === "recording" ? "Stop recording" : "Start recording"}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300
            ${phase === "recording"
              ? "bg-red-500 hover:bg-red-400 scale-110 shadow-lg shadow-red-500/30"
              : isProcessing
                ? "bg-zinc-200 cursor-wait"
                : "bg-zinc-900 hover:scale-105 hover:shadow-xl hover:shadow-zinc-900/20 active:scale-95"
            }
          `}
        >
          {phase === "recording" && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
              <span className="absolute -inset-1 rounded-full border-2 border-red-400 animate-pulse" />
            </>
          )}

          {phase === "recording" ? (
            <span className="h-7 w-7 rounded-md bg-white" />
          ) : isProcessing ? (
            <Spinner />
          ) : (
            <MicIcon size={32} />
          )}
        </button>

        {/* Label / timer */}
        {phase === "recording" ? (
          <div className="text-center">
            <p className="text-2xl font-mono font-semibold text-zinc-900 tabular-nums">
              {formatTime(elapsed)}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Tap to stop · {MAX_SECONDS - elapsed}s remaining
            </p>
          </div>
        ) : isProcessing ? (
          <div className="w-full max-w-xs text-center space-y-3">
            <p className="text-sm text-zinc-600">
              {PHASE_LABEL[phase]}
            </p>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : phase === "idle" ? (
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-800">
              Start your daily debrief
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Up to {MAX_SECONDS / 60} minutes
            </p>
          </div>
        ) : phase === "error" ? (
          <div className="text-center">
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-zinc-400 mt-1">Tap the mic to try again</p>
          </div>
        ) : null}
      </div>

      {/* Result card */}
      {phase === "done" && result && (
        <ResultCard
          extraction={result.extraction}
          tasksCreated={result.tasksCreated}
          onRecordAgain={() => {
            setResult(null);
            setPhase("idle");
          }}
        />
      )}
    </div>
  );
}

function ResultCard({
  extraction,
  tasksCreated,
  onRecordAgain,
}: {
  extraction: ExtractionResult;
  tasksCreated: number;
  onRecordAgain: () => void;
}) {
  const mood = extraction.mood;

  return (
    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{MOOD_EMOJI[mood]}</span>
            <span className="text-sm font-medium text-zinc-800">
              {MOOD_LABELS[mood]}
            </span>
            <span className="text-xs text-zinc-400">
              · Energy {extraction.energy}/10
            </span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {extraction.summary}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
          Done
        </span>
      </div>

      {/* Themes */}
      {extraction.themes.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {extraction.themes.map((t) => (
            <span
              key={t}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Tasks */}
      {extraction.tasks.length > 0 && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">
            Extracted tasks ({tasksCreated})
          </p>
          <div className="space-y-2">
            {extraction.tasks.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg bg-zinc-50 px-3 py-2.5"
              >
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: PRIORITY_COLOR[t.priority] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-700">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {t.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-zinc-400">
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {extraction.insights.length > 0 && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">
            Insights
          </p>
          <ul className="space-y-1.5">
            {extraction.insights.map((ins, i) => (
              <li key={i} className="text-sm text-zinc-500 flex gap-2">
                <span className="text-violet-500 shrink-0">→</span>
                {ins}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-zinc-100 px-5 py-3 flex justify-end">
        <button
          onClick={onRecordAgain}
          className="text-sm text-violet-600 hover:text-violet-500 transition font-medium"
        >
          Record another session
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function bestMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function extFromMime(mime: string): string {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

function MicIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-7 w-7 animate-spin text-zinc-500"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
