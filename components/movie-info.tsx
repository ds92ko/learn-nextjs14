async function getMovie(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
  return response.json();
}

export default async function MovieInfo({ id }: { id: string }) {
  const movie = await getMovie(id);
  return <h6>{JSON.stringify(movie)}</h6>;
}
