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
   
### Loading Components
> server side에서 fetch하는 경우 응답을 기다리는 동안 렌더링 작업이 이루어 지지 않는데, 이때 로딩 컴포넌트를 사용해 로딩 UI를 노출 시킬 수 있음

loading component의 작동 방식
- 로딩 컴포넌트 사용 시 사용자에게는 로딩 UI를 노출하지만 실제로는 백엔드에서 로딩중이기 때문에 브라우저는 백엔드 작업이 완료되지 않았다고 생각함
- streaming을 사용하면서 Next는 페이지의 HTML을 청크로 나누어 먼저 준비된 청크를 브라우저에게 반환하고 await이 끝나면 client에서 loading component를 await 된 component로 교체
- UI가 렌더링 되기 전에 모든 데이터가 로드될 때까지 기다리지 않고 페이지의 일부를 빠르게 노출할 수 있음

loading component 사용 법
- 파일 명은 항상 `loading`이어야 함
- `page`파일과 동일한 경로에 있어야 함

### Parallel Requests
직렬 요청 방식
```tsx
async function getMovie(id: string) {
   console.log(`Fetching movie: ${Date.now()}`);
   await new Promise(resolve => setTimeout(resolve, 5000)); // 응답이 5초 걸린다고 가정
   const response = await fetch(`${API_URL}/${id}`);
   return response.json();
}

async function getVideos(id: string) {
   console.log(`Fetching videos: ${Date.now()}`);
   await new Promise(resolve => setTimeout(resolve, 5000)); // 응답이 5초 걸린다고 가정
   const response = await fetch(`${API_URL}/${id}/videos`);
   return response.json();
}

export default async function MovieDetail({ params: { id } }: { params: { id: string } }) {
   console.log('start fetching');
   const movie = await getMovie(id);
   const videos = await getVideos(id);
   console.log('end fetching');
}
```

output
- movie, videos fetch가 순차적으로 실행됨
- 요청 시간 총 10초 + API 응답 시간 -> 최소 10초 이상 소요
```shell
start fetching
Fetching movie: 1717382782714
Fetching videos: 1717382788223
end fetching
GET /movies/653346 200 in 11006ms
```

병렬 요청 방식
```deff
export default async function MovieDetail({ params: { id } }: { params: { id: string } }) {
  console.log('start fetching');
- const movie = await getMovie(id);
- const videos = await getVideos(id);
+ const [movie, videos] = await Promise.all([getMovie(id), getVideos(id)]);
  console.log('end fetching');
}
```

output
- movie, videos fetch가 동시에 실행됨
- 요청 시간 총 5초 + API 응답 시간 -> 최소 5초 이상 소요
```shell
start fetching
Fetching movie: 1717383063742
Fetching videos: 1717383063742
end fetching
GET /movies/653346 200 in 5528ms
```