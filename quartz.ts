import { componentRegistry } from "./quartz/components/registry"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { QuartzPluginData } from "./quartz/plugins/vfile"

// Folder listings default to date order, falling back to a plain localeCompare
// that reads "100." as smaller than "79." -- lecture notes end up shuffled.
// Sort by name with numeric collation instead, the same rule the explorer uses.
// This has to happen in JS because the option takes a comparator, and YAML can
// only carry data.
const isFolder = (slug?: string) => !!slug && (slug === "index" || slug.endsWith("/index"))
const byNumericName = (a: QuartzPluginData, b: QuartzPluginData) => {
  const aFolder = isFolder(a.slug)
  const bFolder = isFolder(b.slug)
  if (aFolder !== bFolder) return aFolder ? -1 : 1
  const aName = a.frontmatter?.title ?? a.slug ?? ""
  const bName = b.frontmatter?.title ?? b.slug ?? ""
  return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: "base" })
}

componentRegistry.setOptionOverrides("@quartz-community/folder-page", { sort: byNumericName })

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
