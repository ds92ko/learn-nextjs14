import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home'
};

const URL = 'https://nomad-movies.nomadcoders.workers.dev/movies';

async function getMovies() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  const response = await fetch(URL);
  return await response.json();
}

export default async function Home() {
  const movies = await getMovies();
  return <div>{JSON.stringify(movies)}</div>;
}
