"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PRIORITY_COLOR } from "@acuity/shared";

type Task = {
  id: string;
  title: string | null;
  text: string | null;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  snoozedUntil: string | null;
  completedAt: string | null;
  createdAt: string;
  entry: { entryDate: string } | null;
};

type Tab = "open" | "snoozed" | "completed";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const [acting, setActing] = useState<Set<string>>(new Set());

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks?all=1");
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const act = useCallback(
    async (id: string, action: string) => {
      setActing((prev) => new Set(prev).add(id));
      try {
        const res = await fetch("/api/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action }),
        });
        if (res.ok) await fetchTasks();
      } finally {
        setActing((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [fetchTasks]
  );

  const now = Date.now();

  const grouped = useMemo(() => {
    const open: Task[] = [];
    const snoozed: Task[] = [];
    const completed: Task[] = [];

    for (const t of tasks) {
      if (t.status === "DONE") {
        completed.push(t);
      } else if (
        t.status === "SNOOZED" &&
        t.snoozedUntil &&
        new Date(t.snoozedUntil).getTime() > now
      ) {
        snoozed.push(t);
      } else {
        open.push(t);
      }
    }

    return { open, snoozed, completed };
  }, [tasks, now]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "open", label: "Open", count: grouped.open.length },
    { key: "snoozed", label: "Snoozed", count: grouped.snoozed.length },
    { key: "completed", label: "Completed", count: grouped.completed.length },
  ];

  const current = grouped[activeTab];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-50 mb-1">
          Tasks
          {grouped.open.length > 0 && (
            <span className="ml-2 align-middle text-base font-normal text-zinc-500">
              {grouped.open.length} open
            </span>
          )}
        </h1>
        <p className="text-sm text-zinc-400">
          Actions extracted from your brain dumps.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-900 p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-1.5 text-xs ${
                  activeTab === tab.key ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      {current.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-3">
          {current.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              tab={activeTab}
              busy={acting.has(task.id)}
              onAction={act}
            />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const config = {
    open: {
      icon: "✅",
      title: "No open tasks",
      desc: "Record a session to extract tasks automatically.",
    },
    snoozed: {
      icon: "😴",
      title: "No snoozed tasks",
      desc: "Snoozed tasks will appear here.",
    },
    completed: {
      icon: "🎉",
      title: "No completed tasks yet",
      desc: "Complete a task and it will show up here.",
    },
  }[tab];

  return (
    <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-16 text-center">
      <div className="text-3xl mb-3">{config.icon}</div>
      <p className="text-sm font-medium text-zinc-400">{config.title}</p>
      <p className="mt-1 text-xs text-zinc-600">{config.desc}</p>
    </div>
  );
}

function TaskCard({
  task,
  tab,
  busy,
  onAction,
}: {
  task: Task;
  tab: Tab;
  busy: boolean;
  onAction: (id: string, action: string) => void;
}) {
  const label = task.title ?? task.text ?? "Untitled task";
  const priorityColor =
    PRIORITY_COLOR[task.priority] ?? PRIORITY_COLOR.MEDIUM;

  const entryDate = task.entry?.entryDate
    ? new Date(task.entry.entryDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const snoozedUntil =
    tab === "snoozed" && task.snoozedUntil
      ? new Date(task.snoozedUntil).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition hover:border-zinc-700">
      <div className="flex items-start gap-3">
        {/* Priority dot */}
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: priorityColor }}
          title={task.priority}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            className={`text-sm leading-snug ${
              tab === "completed"
                ? "text-zinc-500 line-through"
                : "text-zinc-200"
            }`}
          >
            {label}
          </p>

          {/* Meta row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span
              className="rounded-full px-2 py-0.5 font-medium"
              style={{
                backgroundColor: priorityColor + "18",
                color: priorityColor,
              }}
            >
              {task.priority}
            </span>
            {entryDate && <span>From {entryDate}</span>}
            {dueDate && (
              <span className="text-amber-500">Due {dueDate}</span>
            )}
            {snoozedUntil && (
              <span className="text-blue-400">Until {snoozedUntil}</span>
            )}
          </div>

          {task.description && (
            <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-1.5">
          {tab === "open" && (
            <>
              <ActionBtn
                label="Complete"
                title="Mark complete"
                busy={busy}
                onClick={() => onAction(task.id, "complete")}
              >
                <path d="M20 6 9 17l-5-5" />
              </ActionBtn>
              <ActionBtn
                label="Snooze"
                title="Snooze 24h"
                busy={busy}
                onClick={() => onAction(task.id, "snooze")}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </ActionBtn>
              <ActionBtn
                label="Dismiss"
                title="Dismiss"
                busy={busy}
                onClick={() => onAction(task.id, "dismiss")}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </ActionBtn>
            </>
          )}
          {tab === "snoozed" && (
            <ActionBtn
              label="Reopen"
              title="Reopen now"
              busy={busy}
              onClick={() => onAction(task.id, "reopen")}
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </ActionBtn>
          )}
          {tab === "completed" && (
            <ActionBtn
              label="Reopen"
              title="Reopen"
              busy={busy}
              onClick={() => onAction(task.id, "reopen")}
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </ActionBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  title,
  busy,
  onClick,
  children,
}: {
  label: string;
  title: string;
  busy: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      title={title}
      aria-label={label}
      className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-40"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}
