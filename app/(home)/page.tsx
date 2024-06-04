import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home'
};

async function getMovies() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL);
  return await response.json();
}

export default async function Home() {
  const movies = await getMovies();
  return (
    <div>
      {movies.map(movie => (
        <li key={movie.id}>
          <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </div>
  );
}
