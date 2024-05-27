## 1. INTRODUCTION

### Project Setup
> NextJS를 `create-next-app`이 아닌 수동으로 설치해보자

아래 command로 npm init

```bash
npm init -y
```

자동으로 생성된 package.json의 license ISC → MIT 및 script 변경

```json
{
  "name": "learn-nextjs14",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "next dev"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

아래 command로 react, next, react-dom 최신 버전 설치

```bash
npm install react@latest next@latest react-dom@latest
```

root에 app/page.tsx 생성

```tsx
export default function Page() {
  return <h1>Hello NextJs!</h1>
}
```

아래 command로 next app 구동

```bash
npm run dev
```

- page.tsx의 확장자를 확인하고 자동으로 tsconfig.json 및 관련 devDependencies를 설치해줌
- root layout 파일이 없는것을 확인하고 자동으로 app/layout.tsx를 생성해줌
