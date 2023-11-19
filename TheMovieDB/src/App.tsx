import { useEffect, useState } from "react";
import "./App.css";
import {
  // Importando funções para buscar diferentes tipos de filmes
  GetPopularMovies,
  GetTopRatedMovies,
  GetComedyMovies,
  GetActionMovies,
  GetAdventureMovies,
  TheMovieDB // Tipo de retorno da função para obter informações dos filmes
} from "./services/movie.service";
import { GetMovieDetails } from "./services/movie.details.service"; // Função para obter detalhes de um filme específico
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Carousel, Row, Col } from 'react-bootstrap'; // Componentes do Bootstrap para criar modais, botões, carrosséis, linhas e colunas

function App() {
  // Estados para armazenar os diferentes tipos de filmes e os detalhes de um filme selecionado
  const [popularMovies, setPopularMovies] = useState<TheMovieDB | undefined>();
  const [topRatedMovies, setTopRatedMovies] = useState<TheMovieDB | undefined>();
  const [comedyMovies, setComedyMovies] = useState<TheMovieDB | undefined>();
  const [actionMovies, setActionMovies] = useState<TheMovieDB | undefined>();
  const [adventureMovies, setAdventureMovies] = useState<TheMovieDB | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false); // Estado para controlar a exibição do modal
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null); // Estado para armazenar os detalhes do filme selecionado
  const [modalTitle, setModalTitle] = useState<string>(""); // Estado para o título do modal

  useEffect(() => {
    // Função que é executada quando o componente é montado
    async function fetchData() {
      const apiKey = import.meta.env.VITE_API_KEY; // Chave de API para acesso aos dados dos filmes

      // Obtendo diferentes tipos de filmes usando as funções de serviço e armazenando-os nos estados correspondentes
      const fetchedPopularMovies = await GetPopularMovies(`/movie/popular?language=pt-BR&page=1&api_key=${apiKey}`);
      setPopularMovies(fetchedPopularMovies);

      const fetchedTopRatedMovies = await GetTopRatedMovies(`/movie/top_rated?language=en-US&page=1&api_key=${apiKey}`);
      setTopRatedMovies(fetchedTopRatedMovies);

      const fetchedComedyMovies = await GetComedyMovies(`/discover/movie?include_adult=false&include_video=false&language=enUS&page=1&sort_by=popularity.desc&with_genres=35&api_key=${apiKey}`);
      setComedyMovies(fetchedComedyMovies);

      const fetchedActionMovies = await GetActionMovies(`/discover/movie?include_adult=false&include_video=false&language=enUS&page=1&sort_by=popularity.desc&with_genres=28&api_key=${apiKey}`);
      setActionMovies(fetchedActionMovies);

      const fetchedAdventureMovies = await GetAdventureMovies(`/discover/movie?include_adult=false&include_video=false&language=enUS&page=1&sort_by=popularity.desc&with_genres=12&api_key=${apiKey}`);
      setAdventureMovies(fetchedAdventureMovies);
    }

    fetchData(); // Chamando a função para buscar os dados dos filmes ao carregar o componente
  }, []);

  async function MovieDetails(idMovie: number) {
    // Função para buscar os detalhes de um filme específico usando seu ID
    const movieDetail = await GetMovieDetails(idMovie);
    setSelectedMovie(movieDetail); // Armazena os detalhes do filme selecionado
    setShowModal(true); // Exibe o modal com os detalhes do filme
  }

  const renderCarousel = (title: string, movies: any[]) => {
    // Função para renderizar um carrossel de filmes
    setModalTitle(title);
    setSelectedMovie(movies);
    setShowModal(true);
  };

  const renderLimitedMovies = (title: string, movies: any[]) => {
    // Função para renderizar uma lista limitada de filmes
    const slicedMovies = movies.slice(0, 4); // Limita a exibição a 4 filmes

    return (
      <div>
        <h2>{title}</h2>
        <Row>
          {/* Mapeia os filmes e exibe uma imagem para cada um */}
          {slicedMovies.map((movie) => (
            <Col xs={6} sm={3} key={movie.id} onClick={() => MovieDetails(movie.id)}>
              <img
                style={{ width: '200px', height: '200px' }}
                className="img-fluid"
                src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                alt={movie.original_title}
              />
            </Col>
          ))}
        </Row>
        {/* Carrossel que exibe todas as imagens dos filmes */}
        <Carousel>
          {movies.map((movie, index) => (
            <Carousel.Item key={index}>
              <img
                style={{ width: '200px', height: '200px' }}
                src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                alt={movie.original_title}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    );
  };

  return (
    <div>
      {/* Renderiza as diferentes categorias de filmes com a função renderLimitedMovies */}
      <Row>
        <Col>
          {popularMovies && renderLimitedMovies("Filmes Populares", popularMovies.results || [])}
        </Col>
      </Row>
      <Row>
        <Col>
          {topRatedMovies && renderLimitedMovies("Filmes Mais Curtidos", topRatedMovies.results || [])}
        </Col>
      </Row>
      <Row>
        <Col>
          {comedyMovies && renderLimitedMovies("Filmes de Comédia", comedyMovies.results || [])}
        </Col>
      </Row>
      <Row>
        <Col>
          {actionMovies && renderLimitedMovies("Filmes de Ação", actionMovies.results || [])}
        </Col>
      </Row>
      <Row>
        <Col>
          {adventureMovies && renderLimitedMovies("Filmes de Aventura", adventureMovies.results || [])}
        </Col>
      </Row>

      {/* Modal para exibir os detalhes do filme selecionado */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {selectedMovie && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMovie.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Exibe os detalhes do filme dentro do modal */}
              <p><strong>Título:</strong> {selectedMovie.title}</p>
              <p><strong>Avaliação:</strong> {selectedMovie.vote_average}</p>
              <p><strong>Popularidade:</strong> {selectedMovie.popularity}</p>
              <p><strong>Descrição:</strong> {selectedMovie.overview}</p>
              <p><strong>Tagline:</strong> {selectedMovie.tagline}</p>
              <p><strong>Data de Lançamento:</strong> {selectedMovie.release_date}</p>
              <p><strong>Duração:</strong> {selectedMovie.runtime} minutos</p>
              <p><strong>Gêneros:</strong> {selectedMovie.genres.map((genre: any) => genre.name).join(', ')}</p>
              <p><strong>Receita:</strong> {selectedMovie.revenue}</p>
              <p><strong>IMDb ID:</strong> {selectedMovie.imdb_id}</p>
            </Modal.Body>
            {/* Botão para fechar o modal */}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Fechar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;