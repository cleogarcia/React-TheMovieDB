import { instance } from "../utils/http";

export interface MovieDetails {
  backdrop_path: string;
  budget: number;
  genres: Genre[];
  id: number;
  imdb_id: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

const apiKey = import.meta.env.VITE_API_KEY;

export async function GetMovieDetails(idMovie: number): Promise<MovieDetails> {
  try {
    const result = await instance.http.get(
      `/movie/${idMovie}?language=pt-BR&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error(`Erro ao obter detalhes do filme ${idMovie}:`, error);
    throw new Error(`Erro ao obter detalhes do filme ${idMovie}`);
  }
}
