## 3. DATA FETCHING

### Introduction
- client, server component로부터 data를 fetch 하는 법
- streaming을 사용하는 법
- suspense를 사용하는 법
- loading fallback을 사용하는 법
- error boundary를 사용하는 법

API URL
> https://nomad-movies.nomadcoders.workers.dev/

### Client Side
> client component에서 data를 fetch 하는 법

useEffect, useState를 사용해 data를 fetch
```tsx
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);

    const getMovies = async () => {
        const response = await fetch('https://nomad-movies.nomadcoders.workers.dev/movies');
        const json = await response.json();
        setMovies(json);
        setIsLoading(false);
    };

    useEffect(() => {
        getMovies();
    }, []);

    return <div>{isLoading ? 'Loading...' : JSON.stringify(movies)}</div>;
}
```

- client component에서는 metadata를 export 할 수 없음
- client에서 fetch 할 경우 사용자에게 로딩 상태를 보여줘야 하며 로딩 상태를 직접 확인하고 구현해야 함
- 브라우저가 API에 요청을 보내기 때문에 보안에 취약함

### Server Side
> server component에서 data를 fetch 하는 법

useEffect, useState 없이 data를 fetch
```tsx
const URL = 'https://nomad-movies.nomadcoders.workers.dev/movies';

async function getMovies() {
  await new Promise(resolve => setTimeout(resolve, 5000)); // 응답이 5초 걸린다고 가정
  const response = await fetch(URL);
  return await response.json();
}

export default async function Home() {
  const movies = await getMovies();
  return <div>{JSON.stringify(movies)}</div>;
}
```
- 자동으로 fetch된 url을 캐싱함
- server에서 fetch해도 백엔드의 응답을 기다리는 시간이 발생하고, 로딩중일 경우 사용자에게 어떠한 UI도 노출되지 않음

캐시를 관리하는 방법

1. fetch 옵션 사용하기
   - no-store를 사용하여 항상 최신 데이터 가져오기
   - 매 요청마다 API를 호출하므로 성능에 영향을 줄 수 있음
    ```diff
    const URL = 'https://nomad-movies.nomadcoders.workers.dev/movies';
    
    async function getMovies() {
    - const response = await fetch(URL);
    + const response = await fetch(URL, { cache: 'no-store' });
      return await response.json();
    }
    
    export default async function Home() {
      const movies = await getMovies();
      return <div>{JSON.stringify(movies)}</div>;
    }
    ```
2. revalidate 기능 사용하기
    - revalidate 옵션을 사용하여 일정 시간마다 캐시를 갱신
    - 초 단위
    ```diff
    const URL = 'https://nomad-movies.nomadcoders.workers.dev/movies';
    
    async function getMovies() {
    - const response = await fetch(URL);
    + const response = await fetch(URL, { next: { revalidate: 60 } });
      return await response.json();
    }
    
    export default async function Home() {
    const movies = await getMovies();
    return <div>{JSON.stringify(movies)}</div>;
    }
    ```