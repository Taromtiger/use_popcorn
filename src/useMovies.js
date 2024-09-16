import { useEffect, useState } from 'react';

const KEY = '92cdfb5b';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // callback?.();
    const controller = new AbortController();

    async function fetchMovies() {
      const signal = controller.signal;

      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal }
        );

        if (!res.ok)
          throw new Error('Something went wrong with fwtching movies');

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not Found');

        setMovies(data.Search);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
