"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PendingAction {
  id: string;
  text: string;
  due: "today" | "days" | "week";
  daysUntil?: number;
  completed?: boolean;
}

interface PendingActionsProps {
  actions?: PendingAction[];
  onViewAll?: () => void;
  onToggle?: (id: string) => void;
}

export function PendingActions({
  actions = [
    {
      id: "1",
      text: "Review Monday AI summary — 3 at-risk clients flagged",
      due: "today",
      completed: false,
    },
    {
      id: "2",
      text: "Personal WhatsApp to Anjali Mehta & Vikram Joshi",
      due: "today",
      completed: false,
    },
    {
      id: "3",
      text: "Confirm Neha Singh renewal — program ends Mar 14",
      due: "days",
      daysUntil: 3,
      completed: false,
    },
  ],
  onViewAll,
  onToggle,
}: PendingActionsProps) {
  const [localActions, setLocalActions] = useState(actions);

  const handleToggle = (id: string) => {
    setLocalActions((prev) =>
      prev.map((action) =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
    onToggle?.(id);
  };

  const getDotColor = (due: string) => {
    switch (due) {
      case "today":
        return "bg-brand";
      case "days":
        return "bg-warning";
      case "week":
        return "bg-success";
      default:
        return "bg-brand";
    }
  };

  const getDueLabel = (action: PendingAction) => {
    if (action.due === "today") return "Today";
    if (action.due === "days" && action.daysUntil) return `${action.daysUntil} days`;
    if (action.due === "week") return "This week";
    return "";
  };

  return (
    <div className="card">
      <div className="card-hd">
        <div className="card-hd-title">Pending actions</div>
        <button className="card-hd-action" onClick={onViewAll}>
          View all
        </button>
      </div>

      <div className="pending-list">
        {localActions.map((action) => (
          <div key={action.id} className="pending-row">
            <button
              className={`pcheck ${action.completed ? "done" : ""}`}
              onClick={() => handleToggle(action.id)}
              aria-label={action.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {action.completed && <Check className="h-2.5 w-2.5" />}
            </button>
            <div className={`pcheck-text ${action.completed ? "completed" : ""}`}>
              {action.text}
            </div>
            <div className="pwhen">
              <div className={`pdot ${getDotColor(action.due)}`} />
              {getDueLabel(action)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
