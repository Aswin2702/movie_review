/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { Loader } from "./Components/Loader";
import { Search } from "./Components/Search";
import { NumResults } from "./Components/NumResults";
import { Box } from "./Components/Box";
import { MovieDetails } from "./Components/MovieDetails";
import { MovieList } from "./Components/MovieList";
import { WatchedSummary } from "./Components/WatchedSummary";
import { WatchedMovieList } from "./Components/WatchedMovieList";
import { ErrorMessage } from "./Components/ErrorMessage";

export const Api_key = import.meta.VITE_API_KEY;

export default function App() {
  const data = JSON.parse(localStorage.getItem("data"))?.watched;
  const [query, setQuery] = useState("avengers");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(data ? data : []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchList(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Api_key}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies.");
        }

        const data = await res.json();
        if (data.Response == "False") {
          throw new Error("Movie is not found!");
        }
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  localStorage.setItem("data", JSON.stringify({ watched: watched }));

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main movies={movies}>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedList={handleAddWatchList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
