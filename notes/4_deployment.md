## 4. DEPLOYMENT

### CSS Modules
> Next에서는 별도의 설치 없이 CSS Module을 사용할 수 있음

CSS Module 생성 규칙
- `{파일명}.module.css`로 파일을 생성. 반드시 파일명이 `.module.css`로 끝나야 함
- 스타일시트 작성 시 선택자를 className으로만 지정
- 사용처에서 styles를 import한 후 스타일을 지정할 태그에 className 속성을 `styles.{className}`로 지정

```jsx
import styles from '../styles/navigation.module.css';

export default function Navigation() {
  return (
      <nav className={styles.nav}>...</nav>
  );
}
```