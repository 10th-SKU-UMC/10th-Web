import axios from "axios";
import { useEffect, useState } from "react";

export default function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });

        setData(response.data);
      } catch {
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);
  return { data, isLoading, error };
}
