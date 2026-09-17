import MarkdownIt, { type StateInline } from 'markdown-it'
import katex from 'katex'

export const md = new MarkdownIt({ html: true, linkify: true })

// Render ```math fenced blocks as KaTeX display math instead of falling
// through to a plain <pre><code class="language-math"> block. Every other
// fenced language still goes through the untouched default renderer.
const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules)
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token?.info.trim() === 'math') {
    return katex.renderToString(token.content, { displayMode: true, throwOnError: false })
  }
  return defaultFence(tokens, idx, options, env, self)
}

// $$ ... $$ on its own line(s) — block-level display math.
md.block.ruler.before('fence', 'math_block', (state, startLine, endLine, silent) => {
  const lineText = state.src.slice(
    state.bMarks[startLine]! + state.tShift[startLine]!,
    state.eMarks[startLine],
  )
  if (!lineText.trim().startsWith('$$')) return false

  const rest = lineText.trim().slice(2)
  let content: string
  let nextLine: number

  if (rest.trim().endsWith('$$') && rest.trim().length >= 2) {
    content = rest.trim().slice(0, -2)
    nextLine = startLine + 1
  } else {
    content = rest
    nextLine = startLine + 1
    let closed = false
    while (nextLine < endLine) {
      const closeLine = state.src.slice(
        state.bMarks[nextLine]! + state.tShift[nextLine]!,
        state.eMarks[nextLine],
      )
      if (closeLine.trim() === '$$') {
        closed = true
        nextLine++
        break
      }
      content += '\n' + closeLine
      nextLine++
    }
    if (!closed) return false
  }

  if (silent) return true

  state.line = nextLine
  const token = state.push('math_block', '', 0)
  token.block = true
  token.content = content.trim()
  token.map = [startLine, nextLine]
  return true
})

md.renderer.rules.math_block = (tokens, idx) =>
  katex.renderToString(tokens[idx]!.content, { displayMode: true, throwOnError: false }) + '\n'

// Whether the `$` at `pos` can open/close an inline math span — mirrors the
// pandoc/texmath convention so stray currency like "$5" isn't treated as math.
function delimFlags(state: StateInline, pos: number) {
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const nextChar = pos + 1 <= state.posMax ? state.src.charCodeAt(pos + 1) : -1

  const isSpace = (ch: number) => ch === 0x20 || ch === 0x09
  const isDigit = (ch: number) => ch >= 0x30 && ch <= 0x39

  return {
    canOpen: !isSpace(nextChar) && !isDigit(nextChar),
    canClose: !isSpace(prevChar),
  }
}

// $$ ... $$ inline (mid-paragraph) — also rendered as display math.
md.inline.ruler.before('escape', 'math_inline_block', (state, silent) => {
  if (state.src.charCodeAt(state.pos) !== 0x24 || state.src.charCodeAt(state.pos + 1) !== 0x24) {
    return false
  }
  if (!delimFlags(state, state.pos).canOpen) return false

  const start = state.pos + 2
  const end = state.src.indexOf('$$', start)
  if (end === -1) return false

  const content = state.src.slice(start, end)
  if (!content.trim()) return false

  if (!silent) {
    const token = state.push('math_inline_block', '', 0)
    token.content = content.trim()
  }
  state.pos = end + 2
  return true
})

md.renderer.rules.math_inline_block = (tokens, idx) =>
  katex.renderToString(tokens[idx]!.content, { displayMode: true, throwOnError: false })

// $ ... $ — inline math.
md.inline.ruler.before('escape', 'math_inline', (state, silent) => {
  if (state.src.charCodeAt(state.pos) !== 0x24 || state.src.charCodeAt(state.pos + 1) === 0x24) {
    return false
  }
  if (!delimFlags(state, state.pos).canOpen) return false

  let end = state.pos + 1
  let found = false
  while (end < state.posMax) {
    const ch = state.src.charCodeAt(end)
    if (ch === 0x0a) break
    if (ch === 0x24 && delimFlags(state, end).canClose) {
      found = true
      break
    }
    end++
  }
  if (!found) return false

  const content = state.src.slice(state.pos + 1, end)
  if (!content.trim()) return false

  if (!silent) {
    const token = state.push('math_inline', '', 0)
    token.content = content.trim()
  }
  state.pos = end + 1
  return true
})

md.renderer.rules.math_inline = (tokens, idx) =>
  katex.renderToString(tokens[idx]!.content, { displayMode: false, throwOnError: false })
