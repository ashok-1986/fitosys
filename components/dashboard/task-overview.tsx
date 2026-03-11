"use client";

import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Heart,
  Users,
  BarChart3,
  Tag,
  Plus,
} from "lucide-react";

interface TaskOverviewItem {
  id: string;
  name: string;
  icon: "dumbbell" | "heart" | "users" | "chart" | "tag";
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
  dumbbell: Dumbbell,
  heart: Heart,
  users: Users,
  chart: BarChart3,
  tag: Tag,
};

export function TaskOverview({
  tasks = [
    {
      id: "1",
      name: "12-Week Body Recomposition",
      icon: "dumbbell",
      clients: [
        { id: "1", name: "Rajesh K.", initials: "R", gradient: "linear-gradient(135deg,#7f0000,#c00)" },
        { id: "2", name: "Anita M.", initials: "A", gradient: "linear-gradient(135deg,#003366,#0055a5)" },
      ],
      additionalCount: 8,
    },
    {
      id: "2",
      name: "8-Week Strength Foundation",
      icon: "heart",
      clients: [
        { id: "3", name: "Neha S.", initials: "N", gradient: "linear-gradient(135deg,#4a1942,#7b2d72)" },
      ],
      additionalCount: 5,
    },
    {
      id: "3",
      name: "4-Week Yoga Flow Batch",
      icon: "users",
      clients: [
        { id: "4", name: "Deepa R.", initials: "D", gradient: "linear-gradient(135deg,#003d1f,#00703a)" },
      ],
      additionalCount: 3,
    },
    {
      id: "4",
      name: "Performance Metrics Review",
      icon: "chart",
      clients: [
        { id: "5", name: "Vikram P.", initials: "V", gradient: "linear-gradient(135deg,#2c1654,#512da8)" },
      ],
    },
    {
      id: "5",
      name: "Competitive Renewals 2026",
      icon: "tag",
      clients: [
        { id: "6", name: "Multiple", initials: "+4", gradient: "linear-gradient(135deg,#1a3a1a,#2e7d32)" },
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
