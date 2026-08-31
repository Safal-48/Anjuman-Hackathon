"use client";

import React from "react";
import { Filter, Calendar, Building, Layers } from "lucide-react";

interface InstitutionFilterBarProps {
  department: string;
  academicYear: string;
  dateRange: string;
  onDepartmentChange: (dept: string) => void;
  onAcademicYearChange: (year: string) => void;
  onDateRangeChange: (range: string) => void;
}

export function InstitutionFilterBar({
  department,
  academicYear,
  dateRange,
  onDepartmentChange,
  onAcademicYearChange,
  onDateRangeChange,
}: InstitutionFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
      <div className="flex items-center gap-1.5 text-muted-foreground font-mono font-semibold">
        <Filter className="h-3.5 w-3.5 text-cyan-400" />
        <span>ANALYTICS FILTERS:</span>
      </div>

      {/* Department Filter */}
      <select
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 font-semibold text-foreground focus:ring-1 focus:ring-cyan-500 cursor-pointer"
      >
        <option value="all">All Departments (1,420 Students)</option>
        <option value="cs_ai">Computer Science & AI (420 Students)</option>
        <option value="ece">Electronics & Embedded (380 Students)</option>
        <option value="is_cloud">Information Science & Cloud (340 Students)</option>
        <option value="mech_robotics">Mechanical & Robotics (280 Students)</option>
      </select>

      {/* Academic Year Filter */}
      <select
        value={academicYear}
        onChange={(e) => onAcademicYearChange(e.target.value)}
        className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 font-semibold text-foreground focus:ring-1 focus:ring-cyan-500 cursor-pointer"
      >
        <option value="all">All Batches (2025 - 2028)</option>
        <option value="graduating_2026">Graduating Batch 2026</option>
        <option value="pre_final_2027">Pre-Final Year 2027</option>
        <option value="sophomore_2028">Sophomore Year 2028</option>
      </select>

      {/* Date Range Filter */}
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
      >
        <option value="current_semester">Current Academic Semester</option>
        <option value="last_12_months">Last 12 Months (Full Cycle)</option>
        <option value="all_time">All-Time Cumulative</option>
      </select>
    </div>
  );
}
