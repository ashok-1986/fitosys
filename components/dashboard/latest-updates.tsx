"use client";

import { ChevronDown } from "lucide-react";

interface UpdateItem {
  id: string;
  clientName: string;
  clientInitials: string;
  programName: string;
  message: string;
  gradient: string;
}

interface TagItem {
  id: string;
  name: string;
  description: string;
  color?: string;
}

interface LatestUpdatesProps {
  updates?: UpdateItem[];
  tags?: TagItem[];
  onViewAll?: () => void;
}

export function LatestUpdates({
  updates = [
    {
      id: "1",
      clientName: "Anjali M.",
      clientInitials: "A",
      programName: "12-Week Recomp",
      message: "Energy 8/10 — ran 5km non-stop! 🏃",
      gradient: "linear-gradient(135deg,#7f0000,#c00)",
    },
    {
      id: "2",
      clientName: "Rahul S.",
      clientInitials: "R",
      programName: "8-Week Strength",
      message: "7/10 energy, 3 of 4 sessions done 💪",
      gradient: "linear-gradient(135deg,#003366,#0055a5)",
    },
  ],
  tags = [
    {
      id: "1",
      name: "#at-risk",
      description: "No response 2wks",
    },
    {
      id: "2",
      name: "#renewals",
      description: "4 expiring soon",
    },
    {
      id: "3",
      name: "#strong",
      description: "Rahul, Deepa PBs",
    },
  ],
  onViewAll,
}: LatestUpdatesProps) {
  return (
    <div className="card">
      <div className="card-hd">
        <div className="card-hd-title">Latest updates</div>
        <button className="card-hd-action" onClick={onViewAll}>
          All
        </button>
      </div>

      <div className="updates-list">
        {updates.map((update) => (
          <div key={update.id} className="upd-row">
            <div
              className="upd-face"
              style={{ background: update.gradient }}
            >
              {update.clientInitials}
            </div>
            <div className="upd-body">
              <div className="upd-meta">
                <strong>{update.clientName}</strong> in {update.programName}
              </div>
              <div className="upd-line">{update.message}</div>
            </div>
            <ChevronDown className="upd-arr h-2.5 w-2.5" />
          </div>
        ))}
      </div>

      <div className="tag-strip">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-pill">
            <div className="tag-top">
              <span className="tag-name">{tag.name}</span>
              <ChevronDown className="h-2 w-2" />
            </div>
            <span className="tag-desc">{tag.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
