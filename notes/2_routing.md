## 2. ROUTING

### Defining Routes

React와 Next의 Routing 방식 비교
- React에서는 react-router을 사용해서 URL을 지정하고 컴포넌트 render 요청을 하는 방식으로 라우팅
- Next에서는 파일시스템을 통해 URL을 표현

Next에서 새로운 페이지 만들기
1. app 디렉토리 하위에 URL과 동일한 구조로 폴더를 생성
2. 생성한 폴더에 `page.tsx` 파일을 생성해 해당 페이지에서 렌더링할 UI 제공
3. `page.tsx`가 없다면 해당 경로는 유효하지 않음

### Not Found Routes

Not Found 페이지 만들기
- `not-found.tsx` 파일을 생성해 404에러 발생 시 렌더링할 UI 제공

Navigation 컴포넌트 만들기
1. root에 components 디렉토리 생성
2. a 태그 대신 next/link의 Link를 사용
3. next/navigation의 usePathname이라는 hook을 사용해 user가 현재 머물고 있는 페이지 표시
    - usePathname은 client component에서만 작동

### SSR vs CSR

React와 Next의 Rendering 방식 비교
> Rendering이란 React code를 브라우저가 이해할 수 있는 HTML로 바꾸는 작업

React의 Rendering 방식
- React에서는 client 단에서 모든 rendering 작업 수행
- 브라우저가 모든 JS 파일을 다운로드, 실행한 후에 UI가 그려짐
- 네트워크 연결 상태가 좋지 못한 경우 JS 파일을 읽는 시간이 오래 걸려 빈 화면의 노출 시간이 길어짐
- SEO 검색 엔진 최적화에 불리

Next의 Rendering 방식
- 모든 컴포넌트(server/client)와 페이지는 서버에서 render 됨
- JS가 비활성화 되거나 느리게 Load 되어도 최소한의 dummy HTML을 가지고 있음

### Hydration

> Hydration이란 아무런 기능을 하지 않는 단순 HTML을 React application으로 initialize 해서 interactive app으로 변환하는 작업

### 'use client'
- 모든 컴포넌트(server/client)는 server 단에서 render 됨
- 'use client' 지시어를 가진 컴포넌트만 client 단에서 hydrate 됨

server component
- 'use client'를 선언하지 않으면 기본적으로 모두 server component
- hydrate가 일어나지 않음
- 사용자가 JS를 다운로드 받지 않아도 됨