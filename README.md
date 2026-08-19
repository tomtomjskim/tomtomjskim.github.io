# tomtomjskim.github.io

김정식의 공개 개발 포트폴리오를 보여주는 GitHub Pages 저장소입니다.

## 내용 관리 구조

```text
tomtomjskim/portfolio
= 사례 원문, 요약, 공개 근거

tomtomjskim/tomtomjskim.github.io
= 화면 구성, 스타일, 정적 빌드와 배포
```

사례 전문을 이 저장소에 복사해 별도로 관리하지 않습니다. GitHub Actions가 `tomtomjskim/portfolio`의 `main`을 받아 정적 페이지를 생성합니다.

## 로컬 실행

포트폴리오 저장소가 형제 경로에 있는 경우:

```bash
git clone https://github.com/tomtomjskim/portfolio.git ../portfolio
npm ci
npm run dev
```

다른 경로를 사용하면 `PORTFOLIO_SOURCE_DIR`을 지정합니다.

```bash
PORTFOLIO_SOURCE_DIR=/path/to/portfolio npm run build
```

## 확인 명령

```bash
npm run validate:content
npm run typecheck
npm run build
npm run smoke:static
```

## 공개 경로

- `/`
- `/cases/commerce-change-impact/`
- `/cases/mes-requirement-modeling/`
- `/cases/practical-ai-automation/`
- `/cases/developer-internal-tooling/`
- `/about/`
