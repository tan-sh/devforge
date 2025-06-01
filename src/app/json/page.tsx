'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileJson, Copy, Download, Minimize2, Maximize2, Info, ChevronDown } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import './styles.css'

interface JSONAnalysis {
  size: number
  depth: number
  keys: number
  arrays: number
  objects: number
}

const commonExamples = [
  {
    description: 'Simple Object',
    example: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}`
  },
  {
    description: 'Nested Array',
    example: `{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"},
    {"id": 3, "name": "Charlie"}
  ]
}`
  },
  {
    description: 'Complex Object',
    example: `{
  "company": "Tech Corp",
  "employees": [
    {
      "id": 1,
      "details": {
        "name": "John Smith",
        "role": "Developer",
        "skills": ["JavaScript", "React", "Node.js"]
      }
    }
  ],
  "founded": 2020
}`
  }
]

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null)
  const [isMinified, setIsMinified] = useState(false)
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false)

  const analyzeJSON = (obj: any, depth = 1): JSONAnalysis => {
    let analysis = { size: 0, depth, keys: 0, arrays: 0, objects: 0 }
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        analysis.arrays++
        obj.forEach(item => {
          const itemAnalysis = analyzeJSON(item, depth + 1)
          analysis = {
            size: analysis.size + itemAnalysis.size,
            depth: Math.max(analysis.depth, itemAnalysis.depth),
            keys: analysis.keys + itemAnalysis.keys,
            arrays: analysis.arrays + itemAnalysis.arrays,
            objects: analysis.objects + itemAnalysis.objects
          }
        })
      } else {
        analysis.objects++
        analysis.keys += Object.keys(obj).length
        Object.values(obj).forEach(value => {
          const valueAnalysis = analyzeJSON(value, depth + 1)
          analysis = {
            size: analysis.size + valueAnalysis.size,
            depth: Math.max(analysis.depth, valueAnalysis.depth),
            keys: analysis.keys + valueAnalysis.keys,
            arrays: analysis.arrays + valueAnalysis.arrays,
            objects: analysis.objects + valueAnalysis.objects
          }
        })
      }
    } else {
      analysis.size = JSON.stringify(obj).length
    }
    
    return analysis
  }

  const formatJSON = () => {
    try {
      if (!input.trim()) {
        setError('Please enter some JSON data')
        setFormatted('')
        setAnalysis(null)
        return
      }

      const parsedJSON = JSON.parse(input)
      const formattedJSON = JSON.stringify(parsedJSON, null, isMinified ? 0 : 2)
      setFormatted(formattedJSON)
      setError(null)
      setAnalysis(analyzeJSON(parsedJSON))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setAnalysis(null)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadJSON = () => {
    const blob = new Blob([formatted], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text')
    try {
      // Try to parse the pasted text as JSON
      JSON.parse(pastedText)
      // If successful, let the default paste happen
      setTimeout(() => formatJSON(), 0)
    } catch (err) {
      // If not valid JSON, just let the default paste happen
    }
  }

  return (
    <div className="flex-1">
      <main className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3 text-emerald-500">
            <FileJson size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">JSON Formatter</h1>
          </div>

          {/* Instructions Card */}
          <Card className="p-4" hasGlow>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-emerald-500">
                  <Info size={16} />
                  <h2 className="text-base font-semibold">How to Use</h2>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-emerald-500 transition-transform duration-200 ${
                    isInstructionsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`grid gap-4 transition-all duration-200 ${
                isInstructionsExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}>
                <div className="overflow-hidden">
                  <div className="text-base text-muted-foreground">
                    <p className="mb-4">
                      1. Paste or type your JSON in the input field<br />
                      2. Click the Format button to beautify and validate<br />
                      3. Use the minify/expand toggle to control output format<br />
                      4. View analysis metrics and copy/download the result
                    </p>
                  </div>
                  <div className="border-t border-emerald-500/20 pt-4">
                    <h3 className="text-base font-semibold text-emerald-500 mb-3">Example JSON Structures</h3>
                    <div className="grid gap-2">
                      {commonExamples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="group p-3 rounded-md bg-background/50 hover:bg-emerald-500/5 transition-colors cursor-pointer"
                          onClick={() => {
                            setInput(example.example)
                            setTimeout(formatJSON, 0)
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-emerald-500">{example.description}</span>
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {example.example.split('\n')[0]}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="p-4" hasGlow>
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground/90">Input JSON</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={formatJSON}
                    className="text-emerald-500 hover:text-emerald-400"
                  >
                    Format
                  </Button>
                </div>
                <textarea
                  className="flex-grow min-h-[400px] bg-background/50 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Paste your JSON here..."
                  spellCheck={false}
                />
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-4" hasGlow>
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground/90">Formatted JSON</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMinified(!isMinified)
                        if (formatted) formatJSON()
                      }}
                      className="text-emerald-500 hover:text-emerald-400"
                      title={isMinified ? "Expand" : "Minify"}
                    >
                      {isMinified ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="text-emerald-500 hover:text-emerald-400"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadJSON}
                      className="text-emerald-500 hover:text-emerald-400"
                      title="Download JSON"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
                
                {error ? (
                  <div className="flex-grow flex items-start">
                    <div className="w-full p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500">
                      {error}
                    </div>
                  </div>
                ) : formatted ? (
                  <>
                    <CodeBlock
                      code={formatted}
                      className="flex-grow bg-background/50 rounded-md p-4 font-mono text-sm"
                    />
                    {analysis && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-emerald-500">{analysis.size}</div>
                          <div className="text-xs text-muted-foreground">Size (bytes)</div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-emerald-500">{analysis.depth}</div>
                          <div className="text-xs text-muted-foreground">Depth</div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-emerald-500">{analysis.keys}</div>
                          <div className="text-xs text-muted-foreground">Keys</div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-emerald-500">{analysis.objects}</div>
                          <div className="text-xs text-muted-foreground">Objects</div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-emerald-500">{analysis.arrays}</div>
                          <div className="text-xs text-muted-foreground">Arrays</div>
                        </Card>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-muted-foreground">
                    Format your JSON to see the result here
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 