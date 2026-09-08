import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { DOMParser } from "@xmldom/xmldom"
import { prepareThemedMermaidSvgDualOutput } from "@dev-centr/mermaid-svg-css-vars"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const directory = path.join(root, "diagrams")
const raw = path.join(directory, ".vibe-search-stack.raw.svg")
const check = process.argv.includes("--check")
const mermaidCli = fileURLToPath(new URL("cli.js", import.meta.resolve("@mermaid-js/mermaid-cli")))

mkdirSync(directory, { recursive: true })
execFileSync(process.execPath, [mermaidCli, "-i", path.join(directory, "vibe-search-stack.mmd"), "-o", raw, "-c", path.join(directory, "mermaid-config.json"), "-b", "transparent", "-q"], {
  cwd: root,
  stdio: "inherit",
})

let source = readFileSync(raw, "utf8")
source = source.replace(/\srole="[^"]*"/, "").replace(/\saria-roledescription="[^"]*"/, "")
source = source.replace(/<svg\b([^>]*)>/, '<svg$1 role="img" preserveAspectRatio="xMidYMid meet" aria-labelledby="vibe-search-stack-title vibe-search-stack-desc"><title id="vibe-search-stack-title">Vibe Search architecture</title><desc id="vibe-search-stack-desc">The desktop client uses vibe-search-core to orchestrate Densor inference and vector-store-dlang storage.</desc>')
const manifest = JSON.parse(readFileSync(path.join(directory, "vibe-search-stack.theme.json"), "utf8"))
const result = prepareThemedMermaidSvgDualOutput(source, manifest)
const errors = result.diagnostics.filter(({ severity }) => severity === "error")
if (errors.length || !result.standaloneSvg || !result.hostSvg) throw new Error(JSON.stringify(result.diagnostics, null, 2))

let stale = false
for (const [suffix, svg] of [[".svg", result.standaloneSvg], [".host.svg", result.hostSvg]]) {
  const document = new DOMParser({ onError: () => { throw new Error("invalid generated XML") } }).parseFromString(svg, "image/svg+xml")
  if (document.documentElement.nodeName !== "svg" || !document.documentElement.getAttribute("viewBox")) throw new Error("generated SVG lacks a viewBox")
  if (/<(?:script|foreignObject|iframe|object|embed|animate|set)\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/i.test(svg)) throw new Error("generated SVG contains unsafe or external content")
  if (/var\(\s*--[^,)]+\)/i.test(svg)) throw new Error("generated CSS variable lacks a fallback")
  const target = path.join(directory, `vibe-search-stack${suffix}`)
  if (check) {
    if (!existsSync(target) || readFileSync(target, "utf8") !== svg) {
      console.error(`stale ${path.relative(root, target)}`)
      stale = true
    }
  } else {
    writeFileSync(target, svg, "utf8")
  }
}
rmSync(raw, { force: true })
if (stale) process.exitCode = 3
