import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<Movie[]> => {
  const response: AxiosResponse<MovieResponse> = await axios.get<MovieResponse>(
    API_URL,
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  return response.data.results;
};
