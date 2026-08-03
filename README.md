# Compile & Run

글의 이미지는 위키링크 임베드(`![[그림.png]]`)로 참조합니다. 경로가 아니라 파일명으로 해석되므로 노트를 다른 폴더로 옮겨도 링크가 깨지지 않습니다.

## 로컬에서 확인

Node 22 이상이 필요합니다.

```bash
npm ci
npx quartz build --serve     # http://localhost:8080
```

## 발행

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해서 GitHub Pages에 배포합니다.

```bash
git add .
git commit -m "add: 새 글"
git push
```

frontmatter에 `draft: true`를 넣은 글은 빌드에서 제외됩니다.

## 설정

`quartz.config.yaml`에서 사이트 제목, `baseUrl`, 테마, 플러그인을 조정합니다. 커스텀 도메인을 쓰지 않으므로 `@quartz-community/cname` 플러그인은 꺼져 있습니다 — 켜면 CNAME 파일이 생성되어 프로젝트 페이지 URL이 깨집니다.

## Quartz 업데이트

```bash
git fetch upstream
git merge upstream/v5
```
