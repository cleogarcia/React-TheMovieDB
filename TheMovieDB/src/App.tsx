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
import { GetMovieDetails } from "./services/movie.details.service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Carousel, Row, Col } from 'react-bootstrap';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  const [popularMovies, setPopularMovies] = useState<TheMovieDB | undefined>();
  const [topRatedMovies, setTopRatedMovies] = useState<TheMovieDB | undefined>();
  const [comedyMovies, setComedyMovies] = useState<TheMovieDB | undefined>();
  const [actionMovies, setActionMovies] = useState<TheMovieDB | undefined>();
  const [adventureMovies, setAdventureMovies] = useState<TheMovieDB | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  

  useEffect(() => {
    async function fetchData() {
      const apiKey = import.meta.env.VITE_API_KEY;

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

    fetchData();
  }, []);

  async function MovieDetails(idMovie: number) {
    const movieDetail = await GetMovieDetails(idMovie);
    setSelectedMovie(movieDetail);
    setShowModal(true);
  }

  const addToFavorites = () => {
    if (!selectedMovie) {
      return;
    }

    const existingFavorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const isAlreadyAdded = existingFavorites.some((fav: any) => fav.id === selectedMovie.id);

    if (!isAlreadyAdded) {
      const updatedFavorites = [...existingFavorites, selectedMovie];
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      alert('Filme adicionado aos favoritos!');
    } else {
      alert('Este filme já está na lista de favoritos!');
    }
  };

  const renderLimitedMovies = (title: string, movies: any[]) => {
    const slicedMovies = movies.slice(0, 4);

    return (
      <div>
        <h2>{title}</h2>
        <Row>
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
              <Button variant="secondary" onClick={() => setShowModal(false)}> Fechar
              </Button>
              <Button variant="primary" onClick={addToFavorites}> Adicionar aos Favoritos
          </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );

//--------------------------------------
return (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Listagem de Filmes</Link>
          </li>
          <li>
            <Link to="/recomendacoes">Recomendação de Filmes</Link>
          </li>
        </ul>
      </nav>

      <switch>
        <Route path="/recomendacoes">
          {/* Aqui implementar a lógica para a tela de recomendações */}
          {/* Recupera os filmes favoritos do localStorage */}
          {/* Use os IDs dos filmes favoritos para obter recomendações da API The Movie DB */}
          {/* Mostrar recomendações na interface */}
          {/* Marcar filmes já adicionados aos favoritos e desabilite o botão de adição */}
          {/* componente separado para isso */}
        </Route>
        <Route path="/">
          {/* Aqui está a lógica para a tela principal (Listagem de Filmes) */}
          {/* Mantenha a lógica existente para a listagem de filmes */}
        </Route>
      </switch>
    </div>
  </Router>
);
}


export default App;