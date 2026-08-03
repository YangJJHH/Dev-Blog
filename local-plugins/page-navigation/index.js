// Plain ESM + preact `h` on purpose: Quartz imports plugin entry points with a
// runtime `import()`, so this file is executed by Node directly and never goes
// through esbuild — no TS, no JSX here.
import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils"

const css = `
.page-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}
.page-navigation a {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: none;
  color: var(--dark);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.page-navigation a:hover {
  background: var(--lightgray);
  border-color: var(--gray);
}
.page-navigation .page-navigation-next {
  grid-column: 2;
  text-align: right;
}
.page-navigation-label {
  font-size: 0.8rem;
  color: var(--gray);
}
.page-navigation-title {
  font-weight: 600;
}
@media all and (max-width: 600px) {
  .page-navigation {
    grid-template-columns: 1fr;
  }
  .page-navigation .page-navigation-next {
    grid-column: 1;
    text-align: left;
  }
}
`

const basename = (slug) => slug.slice(slug.lastIndexOf("/") + 1)
const folderOf = (slug) => {
  const i = slug.lastIndexOf("/")
  return i === -1 ? "" : slug.slice(0, i)
}
const titleOf = (file) => file.frontmatter?.title ?? basename(file.slug)

const link = (fromSlug, file, direction, label) =>
  h(
    "a",
    { class: `page-navigation-${direction}`, href: resolveRelative(fromSlug, file.slug) },
    h("span", { class: "page-navigation-label" }, label),
    h("span", { class: "page-navigation-title" }, titleOf(file)),
  )

const PageNavigation = () => {
  const Component = ({ fileData, allFiles, displayClass }) => {
    const slug = fileData.slug
    if (basename(slug) === "index") return null

    const folder = folderOf(slug)
    const siblings = allFiles
      .filter(
        (f) =>
          f.unlisted !== true &&
          f.slug !== "404" &&
          basename(f.slug) !== "index" &&
          folderOf(f.slug) === folder,
      )
      .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))

    const i = siblings.findIndex((f) => f.slug === slug)
    if (i === -1) return null

    const prev = siblings[i - 1]
    const next = siblings[i + 1]
    if (!prev && !next) return null

    return h(
      "nav",
      { class: ["page-navigation", displayClass].filter(Boolean).join(" ") },
      prev && link(slug, prev, "prev", "← 이전 글"),
      next && link(slug, next, "next", "다음 글 →"),
    )
  }

  Component.displayName = "PageNavigation"
  Component.css = css
  return Component
}

export { PageNavigation }
