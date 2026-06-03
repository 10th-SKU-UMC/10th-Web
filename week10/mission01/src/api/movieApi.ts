import axios from 'axios';
import type { MovieSearchResponse, SearchParams } from '../types/movie';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export const searchMovies = async ({
  query,
  includeAdult,
  language,
}: SearchParams): Promise<MovieSearchResponse> => {
  const { data } = await tmdb.get<MovieSearchResponse>('/search/movie', {
    params: {
      query,
      include_adult: includeAdult,
      language,
    },
  });
  return data;
};
