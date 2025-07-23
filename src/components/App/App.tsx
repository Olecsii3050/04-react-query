import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import MovieModal from "../../components/MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string, page: number = 1) => {
    setLoading(true);
    setError("");
    setSearchQuery(query);
    try {
      const results: Movie[] = await fetchMovies(query, page);
      setMovies(results);
      setTotalPages(Math.ceil(results.length / 2));
      if (results.length === 0) {
        toast.error("No movies found for your request.");
      }
    } catch (error) {
      setError("There was an error fetching movies.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    handleSearch(searchQuery, selected + 1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
