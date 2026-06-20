"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

type SheetData = {
  name: string;
  rows: string[][];
};

export default function ExcelViewerClient() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch("/files/copyright-schedule-june-v5.xlsx");

        if (!response.ok) {
          throw new Error("Excel file not found.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const parsedSheets = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
            header: 1,
            defval: "",
          });

          return {
            name: sheetName,
            rows,
          };
        });

        setSheets(parsedSheets);
        setActiveSheet(parsedSheets[0]?.name || "");
      } catch (err) {
        console.error(err);
        setError("Could not load the Excel file.");
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, []);

  const activeRows = useMemo(() => {
    return sheets.find((sheet) => sheet.name === activeSheet)?.rows || [];
  }, [sheets, activeSheet]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-500">
        Loading Excel preview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
        {error}
      </div>
    );
  }

  if (!sheets.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-500">
        No sheets found in this Excel file.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 md:p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        {sheets.map((sheet) => (
          <button
            key={sheet.name}
            type="button"
            onClick={() => setActiveSheet(sheet.name)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              activeSheet === sheet.name
                ? "bg-white text-black"
                : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {sheet.name}
          </button>
        ))}
      </div>

      <div className="max-h-[75vh] overflow-auto rounded-2xl border border-white/10">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            {activeRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={`min-w-[120px] whitespace-pre-wrap border-r border-white/5 px-3 py-2 align-top ${
                      rowIndex === 0
                        ? "sticky top-0 bg-zinc-900 font-semibold text-white"
                        : "text-zinc-300"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}