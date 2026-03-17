"use client";

import { cn } from "@/lib/utils";
import {
  Activity,
  Zap,
  RefreshCw,
  Target,
  Plus,
} from "lucide-react";

interface TaskOverviewItem {
  id: string;
  name: string;
  icon: "onboarding" | "renewal" | "checkin" | "goal";
  clients: Array<{
    id: string;
    name: string;
    initials: string;
    gradient: string;
  }>;
  additionalCount?: number;
}

interface TaskOverviewProps {
  tasks?: TaskOverviewItem[];
  onViewAll?: () => void;
  onAddData?: () => void;
}

const iconMap = {
  onboarding: Zap,
  renewal: RefreshCw,
  checkin: Activity,
  goal: Target,
};

export function TaskOverview({
  tasks = [
    {
      id: "1",
      name: "Client Onboarding: Rahul M.",
      icon: "onboarding",
      clients: [
        { id: "1", name: "Rahul M.", initials: "RM", gradient: "linear-gradient(135deg,#7f0000,#c00)" },
      ],
    },
    {
      id: "2",
      name: "Weekly Check-in: Priya S.",
      icon: "checkin",
      clients: [
        { id: "3", name: "Priya S.", initials: "PS", gradient: "linear-gradient(135deg,#003366,#0055a5)" },
      ],
    },
    {
      id: "3",
      name: "Renewal Due: Vikram Patil",
      icon: "renewal",
      clients: [
        { id: "4", name: "Vikram P.", initials: "VP", gradient: "linear-gradient(135deg,#4a1942,#7b2d72)" },
      ],
    },
  ],
  onViewAll,
  onAddData,
}: TaskOverviewProps) {
  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-hd">
        <div className="card-hd-title">Task Overview</div>
        <button className="card-hd-action" onClick={onViewAll}>
          View all
        </button>
      </div>

      <div className="task-list">
        {tasks.map((task) => {
          const IconComponent = iconMap[task.icon];
          return (
            <div key={task.id} className="task-row">
              <div className="task-ico">
                <IconComponent className="h-2.5 w-2.5" />
              </div>
              <div className="task-name">{task.name}</div>
              {task.clients.length > 0 && (
                <div className="task-faces">
                  {task.clients.map((client, idx) => (
                    <div
                      key={client.id}
                      className="task-face"
                      style={{
                        background: client.gradient,
                        marginLeft: idx === 0 ? 0 : "-6px",
                      }}
                      title={client.name}
                    >
                      {client.initials}
                    </div>
                  ))}
                  {task.additionalCount && (
                    <div
                      className="task-face"
                      style={{
                        background: "linear-gradient(135deg,#333,#555)",
                      }}
                    >
                      +{task.additionalCount}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="add-data-btn" onClick={onAddData}>
        <Plus className="h-3 w-3" />
        Add data
      </button>
    </div>
  );
}
