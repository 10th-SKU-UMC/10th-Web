import { useEffect, useState } from 'react';
import axios from 'axios';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODQ2ZDIwMmIwMDQ5MzcyYzkxYTlmODFjMjZlYTU5YSIsIm5iZiI6MTc3NDk4MDk3OS4wNjQsInN1YiI6IjY5Y2MwZjczY2IyYjRhMzA5OWNhNDE5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qOvZ8YutakIzebPTpbjZHWTvV3u8cnXy_ZKt3yQSb88';

interface UseFetchResult<T> {
    data: T | null; 
    isPending: boolean;
    isError: boolean;
}

export function useCustomFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const { data: responseData } = await axios.get<T>(url, {
                    headers: { Authorization: `Bearer ${API_TOKEN}` },
                });
                setData(responseData);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isPending, isError };
}
