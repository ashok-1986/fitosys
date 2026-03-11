"use client";

import { Bell, MoreHorizontal, FileText, Send, ChevronDown } from "lucide-react";

interface ProgramCardProps {
  coachName?: string;
  coachInitials?: string;
  programTitle?: string;
  programSubtitle?: string;
  progress?: number;
  onWeeklyReport?: () => void;
  onSend?: () => void;
}

export function ProgramCard({
  coachName = "Priya Kapoor",
  coachInitials = "PK",
  programTitle = "12-Week Recomp",
  programSubtitle = "Batch: March 2026 · 10 clients",
  progress = 73,
  onWeeklyReport,
  onSend,
}: ProgramCardProps) {
  return (
    <div className="prog-card">
      <div className="prog-top">
        <div className="prog-owner">
          <div className="prog-ava">{coachInitials}</div>
          <div>
            <div className="prog-owner-lbl">Coach</div>
            <div className="prog-owner-name">{coachName}</div>
          </div>
        </div>
        <div className="prog-icons">
          <button className="prog-ico-btn" title="Alerts" aria-label="Alerts">
            <Bell className="h-2.5 w-2.5" />
          </button>
          <button className="prog-ico-btn" title="More" aria-label="More options">
            <MoreHorizontal className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <div className="prog-body">
        <div className="prog-title">{programTitle}</div>
        <div className="prog-sub">{programSubtitle}</div>
        <div className="prog-prog-row">
          <div className="prog-prog-lbl">Program progress</div>
          <div className="prog-prog-pct">{progress}%</div>
        </div>
        <div className="prog-track">
          <div
            className="prog-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="prog-bot">
        <button className="prog-rpt-btn" onClick={onWeeklyReport}>
          <FileText className="h-2.5 w-2.5" />
          Weekly report
          <ChevronDown className="h-2 w-2" />
        </button>
        <button className="prog-send" onClick={onSend} aria-label="Send">
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
