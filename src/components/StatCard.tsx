import React from "react";

interface StatCardProps {
  value: number;
  label: string;
  color?: "blue" | "purple" | "green";
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-500 text-blue-600",
    purple: "border-purple-500 text-purple-600",
    green: "border-green-500 text-green-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-blue-500">
      <div className={`text-4xl font-bold mb-2 ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-slate-600 uppercase tracking-wide">{label}</div>
    </div>
  );
};
