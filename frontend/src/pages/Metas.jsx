import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMetasData } from "../hooks/useMetasData";
import MetaCard from "../components/MetaCard";

export default function Metas() {
  const { data, loading, error } = useMetasData();
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedEvaluation, setSelectedEvaluation] = useState("all");
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [selectedResponsable, setSelectedResponsable] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique programs
  const programs = useMemo(() => {
    if (!data?.metas) return [];
    const uniquePrograms = [
      ...new Set(data.metas.map((meta) => meta.programa)),
    ];
    return uniquePrograms.sort();
  }, [data]);

  // Get unique responsables
  const responsables = useMemo(() => {
    if (!data?.metas) return [];
    const uniqueResponsables = [
      ...new Set(
        data.metas
          .map((meta) => meta.dependenciaResponsable)
          .filter((r) => r && r.trim() !== "")
      ),
    ];
    return uniqueResponsables.sort();
  }, [data]);

  // Filter metas
  const filteredMetas = useMemo(() => {
    if (!data?.metas) return [];

    return data.metas.filter((meta) => {
      const matchesProgram =
        selectedProgram === "all" || meta.programa === selectedProgram;
      const matchesEvaluation =
        selectedEvaluation === "all" || meta.evaluacion === selectedEvaluation;
      const matchesEstado =
        selectedEstado === "all" || meta.estadoProyecto === selectedEstado;
      const matchesResponsable =
        selectedResponsable === "all" ||
        meta.dependenciaResponsable === selectedResponsable;
      const matchesSearch =
        meta.indicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.programa.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesProgram &&
        matchesEvaluation &&
        matchesEstado &&
        matchesResponsable &&
        matchesSearch
      );
    });
  }, [
    data,
    selectedProgram,
    selectedEvaluation,
    selectedEstado,
    selectedResponsable,
    searchTerm,
  ]);

  // Count by evaluation
  const evaluationCounts = useMemo(() => {
    if (!data?.metas) return {};

    return data.metas.reduce((acc, meta) => {
      acc[meta.evaluacion] = (acc[meta.evaluacion] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-primary text-xl">Cargando metas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-red-50 border border-error text-error px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error al cargar datos</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              🎯 Metas del Plan Indicativo
            </h1>
            <nav className="flex gap-2">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/metas"
                className="px-4 py-2 rounded-lg bg-white/20 text-white font-semibold"
              >
                Metas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-accent">
            <p className="text-sm text-secondary mb-1">Total Metas</p>
            <p className="text-3xl font-bold text-accent">
              {data?.metas?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-success">
            <p className="text-sm text-secondary mb-1">Avance Alto</p>
            <p className="text-3xl font-bold text-success">
              {evaluationCounts["Avance Alto"] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-warning">
            <p className="text-sm text-secondary mb-1">Avance Medio</p>
            <p className="text-3xl font-bold text-warning">
              {evaluationCounts["Avance Medio"] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-error">
            <p className="text-sm text-secondary mb-1">Avance Bajo</p>
            <p className="text-3xl font-bold text-error">
              {evaluationCounts["Avance Bajo"] || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-primary mb-4">🔍 Filtros</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por indicador o programa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {/* Program Filter */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Programa
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">Todos los programas</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>

            {/* Evaluation Filter */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Evaluación
              </label>
              <select
                value={selectedEvaluation}
                onChange={(e) => setSelectedEvaluation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">Todas las evaluaciones</option>
                <option value="Avance Alto">Avance Alto</option>
                <option value="Avance Medio">Avance Medio</option>
                <option value="Avance Bajo">Avance Bajo</option>
                <option value="Sin Programación">Sin Programación</option>
              </select>
            </div>

            {/* Estado Programado Filter */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Estado
              </label>
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="PROGRAMADO">Programado</option>
                <option value="NO PROGRAMADO">No Programado</option>
              </select>
            </div>

            {/* Responsable Filter */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Responsable
              </label>
              <select
                value={selectedResponsable}
                onChange={(e) => setSelectedResponsable(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">Todos los responsables</option>
                {responsables.map((responsable) => (
                  <option key={responsable} value={responsable}>
                    {responsable}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mt-4 flex items-center gap-2 text-secondary text-sm">
            <span>
              Mostrando {filteredMetas.length} de {data?.metas?.length || 0}{" "}
              metas
            </span>
            {(selectedProgram !== "all" ||
              selectedEvaluation !== "all" ||
              selectedEstado !== "all" ||
              selectedResponsable !== "all" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSelectedProgram("all");
                  setSelectedEvaluation("all");
                  setSelectedEstado("all");
                  setSelectedResponsable("all");
                  setSearchTerm("");
                }}
                className="ml-4 px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Metas Grid */}
        {filteredMetas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-200">
            <p className="text-secondary text-lg">
              No se encontraron metas con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetas.map((meta, index) => (
              <MetaCard key={index} meta={meta} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
