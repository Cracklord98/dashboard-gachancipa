import React from "react";
import ReactECharts from "echarts-for-react";

export default function PerformanceChart({ programPerformance }) {
  if (!programPerformance || Object.keys(programPerformance).length === 0) {
    return (
      <div className="text-center text-secondary">No hay datos disponibles</div>
    );
  }

  const programs = Object.keys(programPerformance).slice(0, 8);
  const t3Data = programs.map(
    (program) => programPerformance[program].t3_cumplimiento
  );
  const t4Data = programs.map(
    (program) => programPerformance[program].t4_cumplimiento
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        let result = params[0].name + "<br/>";
        params.forEach((param) => {
          result += `${param.marker} ${param.seriesName}: <strong>${param.value}%</strong><br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["T3", "T4"],
      top: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: programs.map((program) =>
        program.length > 30 ? program.substring(0, 30) + "..." : program
      ),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: [
      {
        name: "T3",
        type: "bar",
        data: t3Data,
        itemStyle: {
          color: "#D69E2E",
        },
      },
      {
        name: "T4",
        type: "bar",
        data: t4Data,
        itemStyle: {
          color: "#E53E3E",
        },
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
