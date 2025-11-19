import React from "react";

export default function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onChange,
  icon = "📋",
}) {
  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectAll = () => {
    onChange(options);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-primary flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label}
        </label>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
          {selectedValues.length} / {options.length}
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={selectAll}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          Todos
        </button>
        <button
          onClick={clearAll}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          Ninguno
        </button>
      </div>

      {/* Options */}
      <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <label
              key={option}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                isSelected
                  ? "bg-accent/5 border border-accent"
                  : "border border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2"
              />
              <span
                className={`ml-3 text-sm ${
                  isSelected ? "text-primary font-medium" : "text-gray-700"
                }`}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
