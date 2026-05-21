import { useCallback, useEffect, useState } from "react";
import { getProjects } from "../api/projects";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { projects, setProjects, loading, error, refetch };
}
