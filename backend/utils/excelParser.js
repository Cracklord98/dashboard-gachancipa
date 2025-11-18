import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse Excel file and convert to JSON
 * @param {string} filename - Name of the Excel file
 * @returns {Object} Parsed data with metas and metadata
 */
export function parseExcelToJSON(filename = "PlanIndicativo.xlsx") {
  try {
    const filePath = join(__dirname, "../data", filename);
    console.log("📂 Intentando leer archivo Excel desde:", filePath);

    const workbook = xlsx.readFile(filePath);
    console.log("✅ Archivo Excel leído correctamente");
    console.log("📊 Hojas disponibles:", workbook.SheetNames);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log("📄 Usando hoja:", sheetName);

    // Convert to JSON
    const rawData = xlsx.utils.sheet_to_json(worksheet);
    console.log("📋 Filas encontradas:", rawData.length);
    if (rawData.length > 0) {
      console.log(
        "🔑 Columnas detectadas:",
        Object.keys(rawData[0]).slice(0, 10).join(", ") + "..."
      );
    }

    // Transform data to match expected structure
    const metas = rawData.map((row, index) => {
      // Parse numbers safely
      const parseNum = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      };

      // Parse T1-T4 values
      const t1_plan = parseNum(
        row["T1. PLANEADO 2025"] ||
          row["T1 PLANEADO 2025"] ||
          row["T1 PLANEADO"] ||
          row.T1_PLANEADO ||
          row["T1_Plan"]
      );
      const t1_ejec = parseNum(
        row["T1. EJECUTADO 2025"] ||
          row["T1 EJECUTADO 2025"] ||
          row["T1 EJECUTADO"] ||
          row.T1_EJECUTADO ||
          row["T1_Ejec"]
      );
      const t2_plan = parseNum(
        row["T2. PLANEADO 2025"] ||
          row["T2 PLANEADO 2025"] ||
          row["T2 PLANEADO"] ||
          row.T2_PLANEADO ||
          row["T2_Plan"]
      );
      const t2_ejec = parseNum(
        row["T2. EJECUTADO 2025"] ||
          row["T2 EJECUTADO 2025"] ||
          row["T2 EJECUTADO"] ||
          row.T2_EJECUTADO ||
          row["T2_Ejec"]
      );
      const t3_plan = parseNum(
        row["T3. PLANEADO 2025"] ||
          row["T3 PLANEADO 2025"] ||
          row["T3 PLANEADO"] ||
          row.T3_PLANEADO ||
          row["T3_Plan"]
      );
      const t3_ejec = parseNum(
        row["T3. EJECUTADO 2025"] ||
          row["T3 EJECUTADO 2025"] ||
          row["T3 EJECUTADO"] ||
          row.T3_EJECUTADO ||
          row["T3_Ejec"]
      );
      const t4_plan = parseNum(
        row["T4. PLANEADO 2025"] ||
          row["T4 PLANEADO 2025"] ||
          row["T4 PLANEADO"] ||
          row.T4_PLANEADO ||
          row["T4_Plan"]
      );
      const t4_ejec = parseNum(
        row["T.4 EJECUTADO 2025"] ||
          row["T4 EJECUTADO 2025"] ||
          row["T4 EJECUTADO"] ||
          row.T4_EJECUTADO ||
          row["T4_Ejec"]
      );

      // Calculate totals
      const totalPlanExcel = parseNum(
        row["TOTAL PLANEADO 2025"] || row["TOTAL PLANEADO"]
      );
      const totalEjecExcel = parseNum(
        row["TOTAL EJECUTADO 2025"] || row["TOTAL EJECUTADO"]
      );

      const calculatedTotalPlan = t1_plan + t2_plan + t3_plan + t4_plan;
      const calculatedTotalEjec = t1_ejec + t2_ejec + t3_ejec + t4_ejec;

      const totalPlan = totalPlanExcel || calculatedTotalPlan;
      const totalEjec = totalEjecExcel || calculatedTotalEjec;

      // Calculate avance - Fix: 1 means 100%, not 1%
      let avanceExcel = parseNum(
        row["AVANCE 2025"] ||
          row["% TOTAL AVANCE 2025"] ||
          row["% AVANCE"] ||
          row.AVANCE
      );

      // If avance is between 0 and 1, convert to percentage (e.g., 0.85 -> 85%)
      if (avanceExcel > 0 && avanceExcel <= 1) {
        avanceExcel = avanceExcel * 100;
      }

      // Handle errors: if avance is greater than 100 or negative, set to 0
      if (avanceExcel > 100 || avanceExcel < 0) {
        avanceExcel = 0;
      }

      const avance =
        avanceExcel || (totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0);

      return {
        id: row.No || row["N°"] || row.N || row.ID || index + 1,
        eje: (row["   EJE"] || row.EJE || "").trim(),
        sectorPrograma: row.SECTOR || row["SECTOR PROGRAMA"] || "",
        nombreSectorPrograma:
          row["NOMBRE DEL PROGRAMA"] ||
          row["NOMBRE SECTOR PROGRAMA"] ||
          row["NOMBRE SECTOR"] ||
          "",
        objetivoMeta:
          row["OBJETIVO DEL PROGRAMA"] ||
          row["OBJETIVO DE META DO"] ||
          row["OBJETIVO META"] ||
          "",
        metaPrograma:
          row["META DE RESULTADO"] ||
          row["META DE PROGRAMA DO"] ||
          row["META PROGRAMA"] ||
          "",
        nIndicador:
          row["N° META RESULTADO"] ||
          row["N° INDICADOR"] ||
          row.NINDICADOR ||
          "",
        lineaBase: parseFloat(
          row["LÍNEA BASE (2023)"] ||
            row["LINEA BASE (2023)"] ||
            row["LINEA BASE"] ||
            0
        ),
        ejecutado2024: parseFloat(
          row["Ejecutado (2024)"] || row.EJECUTADO || 0
        ),
        esperado2027: parseFloat(
          row["ESPERADO 2027"] || row["ESPERADO 2027_1"] || row.ESPERADO || 0
        ),
        dependenciaResponsable:
          row["DEPENDENCIA RESPONSABLE"] || row.DEPENDENCIA || "",
        nMetasProyecto: parseInt(
          row["N° BANDO DE PROYECTO"] ||
            row["N° METAS EN PROYECTO"] ||
            row["N METAS PROYECTO"] ||
            0
        ),
        nMetasProtect: parseInt(
          row["N° METAS PROYECTO PROTECT"] || row["N METAS PROTECT"] || 0
        ),
        numeroMeta:
          row["N° DE META EN EL PLAN DE DESARROLLO"] ||
          row["NUMERO META"] ||
          "",
        nombre: row["NOMBRE DEL PROYECTO"] || row.NOMBRE || "",
        metaProducto: row["META DE PRODUCTO"] || row.META || "",
        indicadorProducto: row["INDICADOR DE PRODUCTO"] || row.INDICADOR || "",
        lineaBase2023: parseFloat(
          row["LINEA BASE (2023)"] || row["LÍNEA BASE (2023)"] || 0
        ),
        codigoDane: row["CODIGO DANE"] || "",
        codigoCcpet: row["CÓDIGO CCPET"] || row["CODIGO CCPET"] || "",
        indicador: row.INDICADOR || row["INDICADOR DE PRODUCTO"] || "",
        t1_plan,
        t1_ejec,
        t2_plan,
        t2_ejec,
        t3_plan,
        t3_ejec,
        t4_plan,
        t4_ejec,
        totalPlan,
        totalEjec,
        avance,
        avanceEstado: parseFloat(
          row["% TOTAL PLANEADO 2025"] ||
            row["% EN TOTAL DEL ESTADO"] ||
            row["% ESTADO"] ||
            0
        ),
        programa:
          row["NOMBRE DEL PROGRAMA"] ||
          row["ESTADO PROGRAMA DO-NO-DO PROGRAMA"] ||
          row["ESTADO PROGRAMA"] ||
          row.PROGRAMA ||
          row.ESTADO ||
          "Sin Programa",
        estadoProyecto:
          row["ESTADO PROGRAMADO-NO PROGRAMADO"] ||
          row["ESTADO DEL PROYECTO"] ||
          row["ESTADO PROYECTO"] ||
          "",
        evaluacion: calculateEvaluation(avance),
      };
    });

    console.log("✅ Datos transformados correctamente");
    console.log("📊 Total de metas procesadas:", metas.length);
    if (metas.length > 0) {
      console.log("🔍 Primera meta de ejemplo:", {
        id: metas[0].id,
        indicador: metas[0].indicador?.substring(0, 50),
        programa: metas[0].programa,
        t1_plan: metas[0].t1_plan,
        t1_ejec: metas[0].t1_ejec,
        avance: metas[0].avance,
      });
    }

    return {
      metas,
      metadata: {
        totalMetas: metas.length,
        lastUpdated: new Date().toISOString(),
        source: filename,
      },
    };
  } catch (error) {
    console.error("❌ Error parsing Excel file:", error);
    console.error("📍 Error details:", error.message);
    console.error(
      "📂 File path attempted:",
      join(__dirname, "../data", filename)
    );
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Calculate evaluation based on performance
 */
function calculateEvaluation(avance) {
  if (avance >= 90) return "Avance Alto";
  if (avance >= 70) return "Avance Medio";
  if (avance > 0) return "Avance Bajo";
  return "Sin Programación";
}

/**
 * Calculate global metrics from metas data
 */
export function calculateGlobalMetrics(metas) {
  let totalT1Plan = 0,
    totalT1Ejec = 0;
  let totalT2Plan = 0,
    totalT2Ejec = 0;
  let totalT3Plan = 0,
    totalT3Ejec = 0;
  let totalT4Plan = 0,
    totalT4Ejec = 0;
  let totalPlan = 0,
    totalEjec = 0;

  metas.forEach((meta) => {
    totalT1Plan += meta.t1_plan;
    totalT1Ejec += meta.t1_ejec;
    totalT2Plan += meta.t2_plan;
    totalT2Ejec += meta.t2_ejec;
    totalT3Plan += meta.t3_plan;
    totalT3Ejec += meta.t3_ejec;
    totalT4Plan += meta.t4_plan;
    totalT4Ejec += meta.t4_ejec;
    totalPlan += meta.totalPlan;
    totalEjec += meta.totalEjec;
  });

  const cumplimientoT1 =
    totalT1Plan > 0 ? (totalT1Ejec / totalT1Plan) * 100 : 0;
  const cumplimientoT2 =
    totalT2Plan > 0 ? (totalT2Ejec / totalT2Plan) * 100 : 0;
  const cumplimientoT3 =
    totalT3Plan > 0 ? (totalT3Ejec / totalT3Plan) * 100 : 0;
  const cumplimientoT4 =
    totalT4Plan > 0 ? (totalT4Ejec / totalT4Plan) * 100 : 0;
  const cumplimientoGlobal = totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0;

  return {
    cumplimiento_global: Number(cumplimientoGlobal.toFixed(1)),
    cumplimiento_t1: Number(cumplimientoT1.toFixed(1)),
    cumplimiento_t2: Number(cumplimientoT2.toFixed(1)),
    cumplimiento_t3: Number(cumplimientoT3.toFixed(1)),
    cumplimiento_t4: Number(cumplimientoT4.toFixed(1)),
    total_metas: metas.length,
    total_plan: totalPlan,
    total_ejec: totalEjec,
    total_t1_plan: totalT1Plan,
    total_t1_ejec: totalT1Ejec,
    total_t2_plan: totalT2Plan,
    total_t2_ejec: totalT2Ejec,
    total_t3_plan: totalT3Plan,
    total_t3_ejec: totalT3Ejec,
    total_t4_plan: totalT4Plan,
    total_t4_ejec: totalT4Ejec,
  };
}

/**
 * Calculate performance by program
 */
export function calculateProgramPerformance(metas) {
  const programs = {};

  metas.forEach((meta) => {
    const programa = meta.programa || "Sin Programa";

    if (!programs[programa]) {
      programs[programa] = {
        metas_count: 0,
        t1_plan: 0,
        t1_ejec: 0,
        t2_plan: 0,
        t2_ejec: 0,
        t3_plan: 0,
        t3_ejec: 0,
        t4_plan: 0,
        t4_ejec: 0,
        total_plan: 0,
        total_ejec: 0,
      };
    }

    programs[programa].metas_count++;
    programs[programa].t1_plan += meta.t1_plan;
    programs[programa].t1_ejec += meta.t1_ejec;
    programs[programa].t2_plan += meta.t2_plan;
    programs[programa].t2_ejec += meta.t2_ejec;
    programs[programa].t3_plan += meta.t3_plan;
    programs[programa].t3_ejec += meta.t3_ejec;
    programs[programa].t4_plan += meta.t4_plan;
    programs[programa].t4_ejec += meta.t4_ejec;
    programs[programa].total_plan += meta.totalPlan;
    programs[programa].total_ejec += meta.totalEjec;
  });

  // Calculate percentages
  Object.keys(programs).forEach((programa) => {
    const prog = programs[programa];
    prog.t1_cumplimiento =
      prog.t1_plan > 0
        ? Number(((prog.t1_ejec / prog.t1_plan) * 100).toFixed(1))
        : 0;
    prog.t2_cumplimiento =
      prog.t2_plan > 0
        ? Number(((prog.t2_ejec / prog.t2_plan) * 100).toFixed(1))
        : 0;
    prog.t3_cumplimiento =
      prog.t3_plan > 0
        ? Number(((prog.t3_ejec / prog.t3_plan) * 100).toFixed(1))
        : 0;
    prog.t4_cumplimiento =
      prog.t4_plan > 0
        ? Number(((prog.t4_ejec / prog.t4_plan) * 100).toFixed(1))
        : 0;
    prog.total_cumplimiento =
      prog.total_plan > 0
        ? Number(((prog.total_ejec / prog.total_plan) * 100).toFixed(1))
        : 0;
  });

  return programs;
}
