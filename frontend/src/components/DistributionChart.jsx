import React from "react";
import ReactECharts from "echarts-for-react";

export default function DistributionChart({ programPerformance }) {
  if (!programPerformance || Object.keys(programPerformance).length === 0) {
    return (
      <div className="text-center text-secondary">No hay datos disponibles</div>
    );
  }

  // Calculate performance categories
  let highPerformance = 0;
  let mediumPerformance = 0;
  let lowPerformance = 0;

  Object.values(programPerformance).forEach((program) => {
    const avgPerformance = program.total_cumplimiento || 0;
    if (avgPerformance >= 90) {
      highPerformance++;
    } else if (avgPerformance >= 70) {
      mediumPerformance++;
    } else {
      lowPerformance++;
    }
  });

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
    },
    series: [
      {
        name: "Rendimiento",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}: {c}",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: [
          {
            value: highPerformance,
            name: "Alto (≥90%)",
            itemStyle: { color: "#38A169" },
          },
          {
            value: mediumPerformance,
            name: "Medio (70-89%)",
            itemStyle: { color: "#D69E2E" },
          },
          {
            value: lowPerformance,
            name: "Bajo (<70%)",
            itemStyle: { color: "#E53E3E" },
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "450px", width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
}
