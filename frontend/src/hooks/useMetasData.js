import { useState, useEffect } from "react";
import axios from "axios";

// Use environment variable for API URL, fallback to relative path for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export function useMetasData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metasRes, metricsRes, programsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/metas`),
        axios.get(`${API_BASE_URL}/metrics/global`),
        axios.get(`${API_BASE_URL}/metrics/programs`),
      ]);

      setData({
        metas: metasRes.data.data,
        globalMetrics: metricsRes.data.data,
        programPerformance: programsRes.data.data,
        metadata: metasRes.data.metadata,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload: loadData };
}
