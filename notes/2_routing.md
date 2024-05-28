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

[server and client composition patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- sever component 안에 client component를 가질 수 있음
- client component 안에 server component를 가질 수 없음
- client component 안에 'use client'를 선언하지 않은 component가 import 되었을 때도 client 단에서 hydrate 됨

### Layout

Next.js가 페이지를 렌더링 하는 방식
1. root의 layout.tsx를 찾고 해당 파일에서 export된 default component를 render
2. URL을 확인하고 해당 경로에 layout.tsx이 있다면 해당 레이아웃 컴포넌트를 render 
3. 해당 URL과 동일한 경로에 있는 page.tsx를 render

Next.js의 Layout 특징
- 다수의 layout 생성 가능
- 상위 layout과 하위 layout은 서로 상쇄하지 않고 중첩됨
- route groups를 사용해 root layout 대신 여러 layout 사용 가능

route groups
- 폴더명을 괄호로 묶어 그룹화하면 URL에는 아무런 영향 없이 routes를 logical groups으로 만들 수 있음

### Metadata

Next.js의 Metadata 특징
- layout.tsx과 page.tsx에서만 metadata를 export 할 수 있음
- metadata는 server component에서만 사용 가능
- 만약 layout과 page 모두 metadata를 가지고 있다면 metadata 객체가 병합되고 중복되는 항목은 page의 metadata로 덮어쓰여짐

Metadata Template

layout.tsx에 template 제작
```tsx
// app/layout.tsx
export const metadata = {
   title: {
      template: '%s | Next Movies',
      default: 'Next Movies'
   }
}
```

page.tsx에 metadata.title 지정
```tsx
// app/(home)/page.tsx
export const metadata = {
   title: "Home"
}
```

metadata.title을 지정한 페이지의 output
```html
<title>Home | Next Movies</title>
```

metadata.title을 지정하지 않은 페이지의 output
```html
<title>Next Movies</title>
```

### Dynamic routes

- 폴더 이름을 대괄호로 묶어 동적 세그먼트 생성
- 해당 경로의 page.tsx에서 export 되는 default component의 props에는 params와 searchParams가 담겨있음

```shell
# 123?region=kr&page=1
{ params: { id: '123' }, searchParams: { region: 'kr', page: '1' } }
```