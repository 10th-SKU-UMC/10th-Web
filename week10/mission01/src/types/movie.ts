export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  adult: boolean;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type Language = 'ko-KR' | 'en-US' | 'ja-JP';

export interface SearchParams {
  query: string;
  includeAdult: boolean;
  language: Language;
}
