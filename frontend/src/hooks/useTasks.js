import { useCallback, useEffect, useState } from "react";
import { getProjectTasks } from "../api/tasks";

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getProjectTasks(projectId);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tasks, setTasks, loading, error, refetch };
}
