import { instance } from "../utils/http";

export interface TheMovieDB {
  page: number;
  results: Movie[];
}

export interface Movie {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const apiKey = import.meta.env.VITE_API_KEY;

// Mostrar os filmes populares
export async function GetPopularMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/movie/popular?language=pt-BR&page=1&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes populares:', error);
    throw new Error('Erro ao obter filmes populares');
  }
}

// Destacar os filmes mais bem avaliados
export async function GetTopRatedMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/movie/top_rated?language=pt-BR&page=1&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes mais bem avaliados:', error);
    throw new Error('Erro ao obter filmes mais bem avaliados');
  }
}

// Filmes de Comédia
export async function GetComedyMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=35&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes de comédia:', error);
    throw new Error('Erro ao obter filmes de comédia');
  }
}

// Filmes de Ação
export async function GetActionMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes de ação:', error);
    throw new Error('Erro ao obter filmes de ação');
  }
}

// Filmes de Aventura
export async function GetAdventureMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=12&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes de aventura:', error);
    throw new Error('Erro ao obter filmes de aventura');
  }
}

// Filmes de Romance
export async function GetRomanceMovies(): Promise<TheMovieDB> {
  try {
    const result = await instance.http.get(
      `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10749&api_key=${apiKey}`
    );
    return result.data;
  } catch (error) {
    console.error('Erro ao obter filmes de romance:', error);
    throw new Error('Erro ao obter filmes de romance');
  }
}