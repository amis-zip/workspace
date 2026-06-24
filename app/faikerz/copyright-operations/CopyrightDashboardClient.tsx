"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

type Task = {
  id: string;
  category: string;
  client: string;
  workType: string;
  cycle: string;
  deadline: string;
  target: string;
  platform: string;
  note: string;
  workstream: "SNS" | "Monitoring" | "Other";
  dueDate: Date | null;
  dday: number | null;
  needsCheck: boolean;
};

type TabKey = "overview" | "sns" | "monitoring" | "deadlines" | "checks";

const EXCEL_PATH = "/files/copyright-schedule-june-v5.xlsx";
const DEFAULT_MONTH_INDEX = 5; // June

function cleanCell(value: unknown) {
  return String(value ?? "").trim();
}

function findColumn(headers: string[], keywords: string[]) {
  return headers.findIndex((header) =>
    keywords.some((keyword) => header.includes(keyword))
  );
}

function parseDueDate(text: string) {
  if (!text) return null;

  const year = new Date().getFullYear();

  const slashMatch = text.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);

    if (!Number.isNaN(month) && !Number.isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }

  const dayMatch = text.match(/(\d{1,2})\s*일/);
  if (dayMatch) {
    const day = Number(dayMatch[1]);

    if (!Number.isNaN(day)) {
      return new Date(year, DEFAULT_MONTH_INDEX, day);
    }
  }

  return null;
}

function getDday(date: Date | null) {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function getWorkstream(category: string, workType: string) {
  const text = `${category} ${workType}`.toLowerCase();

  if (text.includes("sns")) return "SNS";
  if (
    text.includes("정기") ||
    text.includes("모니터링") ||
    text.includes("저작권")
  ) {
    return "Monitoring";
  }

  return "Other";
}

function isCheckNeeded(task: {
  category: string;
  deadline: string;
  target: string;
  platform: string;
  note: string;
}) {
  const text = [
    task.category,
    task.deadline,
    task.target,
    task.platform,
    task.note,
  ].join(" ");

  return (
    text.includes("확인 필요") ||
    text.includes("확인필요") ||
    text.includes("미확보") ||
    text.includes("미입력") ||
    text.includes("체크") ||
    text.includes("최종수량")
  );
}

function formatDday(dday: number | null) {
  if (dday === null) return "No date";
  if (dday < 0) return `D+${Math.abs(dday)}`;
  if (dday === 0) return "D-Day";
  return `D-${dday}`;
}

function getDdayClass(dday: number | null) {
  if (dday === null) return "border-white/10 text-zinc-500";
  if (dday < 0) return "border-zinc-700 text-zinc-500";
  if (dday <= 3) return "border-red-400/40 bg-red-500/10 text-red-200";
  if (dday <= 7) return "border-yellow-400/40 bg-yellow-500/10 text-yellow-200";
  return "border-white/10 text-zinc-400";
}

export default function CopyrightDashboardClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [sourceSheet, setSourceSheet] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch(EXCEL_PATH);

        if (!response.ok) {
          throw new Error("Excel file not found.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName =
          workbook.SheetNames.find((name) => name.includes("업무마스터")) ||
          workbook.SheetNames.find((name) => name.includes("데드라인")) ||
          workbook.SheetNames[0];

        setSourceSheet(sheetName);

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
          header: 1,
          defval: "",
        });

        const stringRows = rows.map((row) => row.map(cleanCell));

        const headerIndex = stringRows.findIndex((row) => {
          const joined = row.join(" ");
          return joined.includes("구분") && joined.includes("고객사");
        });

        if (headerIndex === -1) {
          throw new Error("Could not find the header row in the Excel file.");
        }

        const headers = stringRows[headerIndex];

        const categoryCol = findColumn(headers, ["구분"]);
        const clientCol = findColumn(headers, ["고객사"]);
        const workTypeCol = findColumn(headers, ["업무 유형", "업무유형"]);
        const cycleCol = findColumn(headers, ["주기", "기간"]);
        const deadlineCol = findColumn(headers, ["데드라인", "마감"]);
        const targetCol = findColumn(headers, ["목표", "수량"]);
        const platformCol = findColumn(headers, ["탐지", "국가", "플랫폼"]);
        const noteCol = findColumn(headers, ["비고", "메모"]);

        const parsedTasks = stringRows
          .slice(headerIndex + 1)
          .map((row, index) => {
            const getValue = (columnIndex: number) =>
              columnIndex >= 0 ? row[columnIndex] || "" : "";

            const category = getValue(categoryCol);
            const client = getValue(clientCol);
            const workType = getValue(workTypeCol);
            const cycle = getValue(cycleCol);
            const deadline = getValue(deadlineCol);
            const target = getValue(targetCol);
            const platform = getValue(platformCol);
            const note = getValue(noteCol);

            const dueDate = parseDueDate(deadline);
            const dday = getDday(dueDate);
            const workstream = getWorkstream(category, workType);
            const needsCheck = isCheckNeeded({
              category,
              deadline,
              target,
              platform,
              note,
            });

            return {
              id: `${sheetName}-${index}`,
              category,
              client,
              workType,
              cycle,
              deadline,
              target,
              platform,
              note,
              workstream,
              dueDate,
              dday,
              needsCheck,
            };
          })
          .filter((task) => {
            return (
              task.client ||
              task.workType ||
              task.deadline ||
              task.target ||
              task.note
            );
          });

        setTasks(parsedTasks);
      } catch (err) {
        console.error(err);
        setError("Could not load copyright operations data.");
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, []);

  const stats = useMemo(() => {
    const dueSoon = tasks.filter(
      (task) => task.dday !== null && task.dday >= 0 && task.dday <= 7
    );

    return {
      total: tasks.length,
      dueSoon: dueSoon.length,
      checks: tasks.filter((task) => task.needsCheck).length,
      sns: tasks.filter((task) => task.workstream === "SNS").length,
      monitoring: tasks.filter((task) => task.workstream === "Monitoring")
        .length,
    };
  }, [tasks]);

  const sortedByDeadline = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.dday === null && b.dday === null) return 0;
      if (a.dday === null) return 1;
      if (b.dday === null) return -1;
      return a.dday - b.dday;
    });
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (activeTab === "sns") {
      return tasks.filter((task) => task.workstream === "SNS");
    }

    if (activeTab === "monitoring") {
      return tasks.filter((task) => task.workstream === "Monitoring");
    }

    if (activeTab === "deadlines") {
      return sortedByDeadline;
    }

    if (activeTab === "checks") {
      return sortedByDeadline.filter((task) => task.needsCheck);
    }

    return sortedByDeadline.filter(
      (task) =>
        task.needsCheck ||
        (task.dday !== null && task.dday >= 0 && task.dday <= 14)
    );
  }, [activeTab, tasks, sortedByDeadline]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-500">
        Loading copyright operations dashboard...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
        {error}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Due in 7 Days" value={stats.dueSoon} tone="urgent" />
        <StatCard label="Check Needed" value={stats.checks} tone="warning" />
        <StatCard label="SNS Review" value={stats.sns} />
        <StatCard label="Monitoring" value={stats.monitoring} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Operations Dashboard
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Schedule Control
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Source sheet: {sourceSheet}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <TabButton
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              label="SNS"
              active={activeTab === "sns"}
              onClick={() => setActiveTab("sns")}
            />
            <TabButton
              label="Monitoring"
              active={activeTab === "monitoring"}
              onClick={() => setActiveTab("monitoring")}
            />
            <TabButton
              label="Deadlines"
              active={activeTab === "deadlines"}
              onClick={() => setActiveTab("deadlines")}
            />
            <TabButton
              label="Check Needed"
              active={activeTab === "checks"}
              onClick={() => setActiveTab("checks")}
            />
          </div>
        </div>

        <div className="space-y-4">
          {visibleTasks.length ? (
            visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="rounded-2xl border border-white/10 p-6 text-zinc-500">
              No tasks found for this filter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "urgent" | "warning";
}) {
  const toneClass =
    tone === "urgent"
      ? "text-red-300"
      : tone === "warning"
      ? "text-yellow-200"
      : "text-white";

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>

      <p className={`mt-4 text-4xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-black"
          : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/30 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
              {task.workstream}
            </span>

            {task.category && (
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                {task.category}
              </span>
            )}

            {task.needsCheck && (
              <span className="rounded-full border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
                Check Needed
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold">
            {task.client || "Untitled Task"}
          </h3>

          {task.workType && (
            <p className="mt-2 text-sm text-zinc-500">{task.workType}</p>
          )}
        </div>

        <div
          className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getDdayClass(
            task.dday
          )}`}
        >
          {formatDday(task.dday)}
        </div>
      </div>

      <div className="grid gap-4 text-sm md:grid-cols-4">
        <Info label="Cycle" value={task.cycle} />
        <Info label="Deadline" value={task.deadline} />
        <Info label="Target" value={task.target} />
        <Info label="Platform" value={task.platform} />
      </div>

      {task.note && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
            Note
          </p>

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {task.note}
          </p>
        </div>
      )}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-zinc-300">
        {value || "—"}
      </p>
    </div>
  );
}