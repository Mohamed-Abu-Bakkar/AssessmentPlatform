import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

const KEYWORDS = {
  javascript: [
    'var','let','const','function','return','if','else','for','while','do','break','continue',
    'new','this','class','extends','super','import','export','from','default','async','await',
    'try','catch','finally','throw','typeof','instanceof','in','of','switch','case','delete',
    'void','yield','static','get','set','true','false','null','undefined','console','Math',
    'Array','Object','String','Number','Boolean','Promise','Map','Set','JSON','Error',
  ],
  typescript: [],
  python: [
    'def','return','if','elif','else','for','while','break','continue','import','from','as',
    'class','try','except','finally','raise','with','lambda','yield','pass','global','nonlocal',
    'assert','del','in','is','not','and','or','True','False','None','print','self','async','await',
  ],
  java: [
    'public','private','protected','class','interface','extends','implements','static','final',
    'void','int','long','double','float','boolean','char','String','new','return','if','else',
    'for','while','do','break','continue','try','catch','finally','throw','throws','import',
    'package','this','super','null','true','false','System',
  ],
  cpp: [
    'int','long','short','char','float','double','bool','void','auto','const','static','return',
    'if','else','for','while','do','break','continue','class','struct','public','private','protected',
    'new','delete','namespace','using','include','template','typename','true','false','nullptr',
    'std','cout','cin','endl',
  ],
  go: [
    'func','return','if','else','for','range','break','continue','package','import','var','const',
    'type','struct','interface','map','chan','go','defer','switch','case','default','true','false',
    'nil','string','int','float64','bool','byte',
  ],
  sql: [
    'SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE',
    'DROP','ALTER','JOIN','LEFT','RIGHT','INNER','OUTER','ON','GROUP','BY','ORDER','HAVING',
    'LIMIT','OFFSET','AND','OR','NOT','NULL','AS','DISTINCT','COUNT','SUM','AVG','MIN','MAX',
  ],
}

KEYWORDS.typescript = [...KEYWORDS.javascript, 'type', 'interface', 'enum', 'namespace', 'readonly', 'implements']

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlightLine(line, language) {
  const keywords = KEYWORDS[language] ?? KEYWORDS.javascript
  const keywordPattern = keywords.length
    ? `\\b(?:${keywords.join('|')})\\b`
    : '\\b(?:undefined|null|true|false)\\b'

  let patterns
  if (language === 'sql') {
    patterns = [
      { type: 'comment', re: /--.*$/ },
      { type: 'string', re: /'(?:''|[^'])*'/ },
      { type: 'number', re: /\b\d+(?:\.\d+)?\b/ },
      { type: 'keyword', re: new RegExp(keywordPattern, 'i') },
      { type: 'function', re: /\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/ },
    ]
  } else {
    patterns = [
      { type: 'comment', re: /\/\/.*$|\/\*[\s\S]*?\*\// },
      { type: 'string', re: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { type: 'number', re: /\b\d+(?:\.\d+)?\b/ },
      { type: 'keyword', re: new RegExp(keywordPattern) },
      { type: 'function', re: /\b[A-Za-z_$][\w$]*(?=\s*\()/ },
    ]
  }

  const tokens = []
  let remaining = line
  let guard = 0

  while (remaining.length > 0 && guard < 5000) {
    guard += 1
    let earliest = null

    for (const p of patterns) {
      p.re.lastIndex = 0
      const match = p.re.exec(remaining)
      if (match && match.index >= 0 && (!earliest || match.index < earliest.match.index)) {
        earliest = { type: p.type, match }
      }
    }

    if (!earliest || earliest.match.index === undefined) break

    const { type, match } = earliest
    if (match.index > 0) {
      tokens.push({ type: 'plain', text: remaining.slice(0, match.index) })
    }
    tokens.push({ type, text: match[0] })
    remaining = remaining.slice(match.index + match[0].length)
    if (match[0].length === 0) {
      tokens.push({ type: 'plain', text: remaining })
      break
    }
  }

  if (remaining) tokens.push({ type: 'plain', text: remaining })

  const colorFor = {
    keyword: 'text-[#c678dd]',
    string: 'text-[#98c379]',
    number: 'text-[#d19a66]',
    comment: 'text-[#7f848e] italic',
    function: 'text-[#61afef]',
    plain: 'text-[#abb2bf]',
  }

  return tokens
    .map((token) => {
      const safe = escapeHtml(token.text)
      if (token.type === 'plain') return safe
      return `<span class="${colorFor[token.type] ?? ''}">${safe}</span>`
    })
    .join('')
}

export default function CodeBlock({ code, language = 'javascript', showLineNumbers = true }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const lines = (code ?? '').split('\n')
  const labelLanguage = (language || 'text').toUpperCase()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code ?? '')
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#282c34] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700 bg-[#21252b] px-3 py-2">
        <span className="font-mono text-xs font-semibold tracking-wide text-slate-300">
          {labelLanguage}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre className="min-w-full p-4 font-mono text-[13px] leading-6 text-[#abb2bf]">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="mr-4 w-7 shrink-0 select-none text-right text-slate-500" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
                <span
                  className="whitespace-pre"
                  dangerouslySetInnerHTML={{
                    __html: highlightLine(line, (language || 'javascript').toLowerCase()) || '&nbsp;',
                  }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
