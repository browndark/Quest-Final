#!/usr/bin/env node
// parse-newman-and-update-readme.js
// Usage: node parse-newman-and-update-readme.js --back path/to/newman-back-report.json --front path/to/newman-front-report.json --readme path/to/Readme.md

const fs = require('fs')
#!/usr/bin/env node
// parse-newman-and-update-readme.js
// Usage: node parse-newman-and-update-readme.js --back path/to/newman-back-report.json --front path/to/newman-front-report.json --readme path/to/Readme.md

const fs = require('fs')
const path = require('path')

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (e) {
    console.error('Failed to parse JSON', p, e.message)
    return null
  }
}

function summarizeRun(newmanJson) {
  if (!newmanJson) return []
  const items = []
  if (!newmanJson.run || !newmanJson.run.executions) return items
  for (const ex of newmanJson.run.executions) {
    const name = ex.item && ex.item.name ? ex.item.name : (ex.request && ex.request.url ? ex.request.url : 'unnamed')
    const status = ex.assertions ? (ex.assertions.some(a => a.error) ? 'FAIL' : 'PASS') : 'NO_ASSERT'
    const code = ex.response ? ex.response.code : ''
    const responseTime = ex.response ? ex.response.responseTime : ''
    items.push({ name, status, code, responseTime })
  }
  return items
}

function toTable(rows) {
  const header = '| Test | Status | HTTP | Time(ms) |\n|---|---:|---:|---:|\n'
  const lines = rows.map(r => `| ${r.name.replace(/\|/g,' ')} | ${r.status} | ${r.code} | ${r.responseTime} |`)
  return header + lines.join('\n') + '\n'
}

function updateReadme(readmePath, backSummary, frontSummary) {
  let md = ''
  try { md = fs.readFileSync(readmePath, 'utf8') } catch (e) { console.error('Cannot read README:', readmePath); return }

  const markerStart = '\n---\n\nRelatório de Execução Postman\n'
  const idx = md.indexOf(markerStart)
  let head = md
  if (idx !== -1) head = md.substring(0, idx + markerStart.length)
  else head = md + '\n\n'

  let body = '\n### Resultado - Backend (automático)\n\n'
  body += toTable(backSummary)
  body += '\n### Resultado - Front (automático)\n\n'
  body += toTable(frontSummary)

  const newMd = head + body
  fs.writeFileSync(readmePath, newMd, 'utf8')
  console.log('Updated README at', readmePath)
}

// --- CLI ---
const args = require('minimist')(process.argv.slice(2))
const backPath = args.back
const frontPath = args.front
const readme = args.readme
if (!readme) { console.error('Missing --readme path'); process.exit(2) }

const backJson = backPath ? loadJson(backPath) : null
const frontJson = frontPath ? loadJson(frontPath) : null
const backSummary = summarizeRun(backJson)
const frontSummary = summarizeRun(frontJson)
updateReadme(readme, backSummary, frontSummary)
