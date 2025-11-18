import React from "react";

export default function MetricCard({
  title,
  value,
  icon,
  color = "blue",
  progress,
  subtitle,
}) {
  const colorClasses = {
    accent: "bg-blue-50 text-accent",
    success: "bg-green-50 text-success",
    warning: "bg-yellow-50 text-warning",
    error: "bg-red-50 text-error",
    primary: "bg-gray-50 text-primary",
  };

  const progressColorClasses = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    primary: "bg-primary",
  };

  const textColorClasses = {
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    primary: "text-primary",
  };

  return (
    <div className="metric-card bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <p className={`text-3xl font-bold ${textColorClasses[color]} mt-1`}>
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`${progressColorClasses[color]} h-2 rounded-full transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {subtitle && (
            <p className="text-xs text-secondary mt-1">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
