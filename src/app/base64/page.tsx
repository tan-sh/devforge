'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Code2, Copy, ArrowDownUp, FileType, Binary, Info, ChevronDown } from 'lucide-react'

interface ConversionStats {
  originalSize: number
  convertedSize: number
  ratio: number
  encoding: string
}

const commonExamples = [
  {
    description: 'Plain Text',
    input: 'Hello, World!',
    encoded: 'SGVsbG8sIFdvcmxkIQ=='
  },
  {
    description: 'JSON Data',
    input: '{"name": "John", "age": 30}',
    encoded: 'eyJuYW1lIjogIkpvaG4iLCAiYWdlIjogMzB9'
  },
  {
    description: 'URL',
    input: 'https://example.com/path?query=value',
    encoded: 'aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoP3F1ZXJ5PXZhbHVl'
  }
]

export default function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ConversionStats | null>(null)
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false)

  const calculateStats = (original: string, converted: string): ConversionStats => {
    const originalSize = new Blob([original]).size
    const convertedSize = new Blob([converted]).size
    return {
      originalSize,
      convertedSize,
      ratio: convertedSize / originalSize,
      encoding: new TextEncoder().encode(original).length === original.length ? 'ASCII' : 'UTF-8'
    }
  }

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setError('Please enter some text to convert')
        setOutput('')
        setStats(null)
        return
      }

      let result: string
      if (mode === 'encode') {
        // Handle encoding
        result = btoa(unescape(encodeURIComponent(input)))
      } else {
        // Handle decoding
        try {
          result = decodeURIComponent(escape(atob(input.trim())))
        } catch {
          throw new Error('Invalid Base64 string')
        }
      }

      setOutput(result)
      setError(null)
      setStats(calculateStats(input, result))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion')
      setOutput('')
      setStats(null)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      setTimeout(handleConvert, 0)
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  const swapInputOutput = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setStats(null)
  }

  return (
    <div className="flex-1">
      <main className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3 text-blue-500">
            <Code2 size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">Base64 Converter</h1>
          </div>

          {/* Instructions Card */}
          <Card className="p-4" hasGlow>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-blue-500">
                  <Info size={16} />
                  <h2 className="text-base font-semibold">How to Use</h2>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-blue-500 transition-transform duration-200 ${
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
                      1. Enter text to encode or Base64 to decode<br />
                      2. Use the swap button to switch between encode/decode modes<br />
                      3. Click the paste icon to paste from clipboard<br />
                      4. View conversion statistics and copy the result
                    </p>
                  </div>
                  <div className="border-t border-blue-500/20 pt-4">
                    <h3 className="text-base font-semibold text-blue-500 mb-3">Common Examples</h3>
                    <div className="grid gap-2">
                      {commonExamples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="group p-3 rounded-md bg-background/50 hover:bg-blue-500/5 transition-colors cursor-pointer"
                          onClick={() => {
                            if (mode === 'encode') {
                              setInput(example.input)
                            } else {
                              setInput(example.encoded)
                            }
                            setTimeout(handleConvert, 0)
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-blue-500">{example.description}</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            <div className="text-sm text-muted-foreground font-mono">
                              Text: {example.input}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                              Base64: {example.encoded}
                            </div>
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
                  <h2 className="text-lg font-semibold text-foreground/90">
                    {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePaste}
                      className="text-blue-500 hover:text-blue-400"
                      title="Paste from clipboard"
                    >
                      <FileType size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={swapInputOutput}
                      className="text-blue-500 hover:text-blue-400"
                      title="Swap input/output"
                    >
                      <ArrowDownUp size={16} />
                    </Button>
                  </div>
                </div>
                <textarea
                  className="flex-grow min-h-[400px] bg-background/50 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setError(null)
                  }}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  spellCheck={false}
                />
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleConvert}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    {mode === 'encode' ? 'Encode' : 'Decode'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-4" hasGlow>
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground/90">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </h2>
                  {output && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(output)}
                      className="text-blue-500 hover:text-blue-400"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </Button>
                  )}
                </div>
                
                {error ? (
                  <div className="flex-grow flex items-start">
                    <div className="w-full p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500">
                      {error}
                    </div>
                  </div>
                ) : output ? (
                  <>
                    <div className="flex-grow bg-background/50 rounded-md p-4 font-mono text-sm overflow-auto">
                      {output}
                    </div>
                    {stats && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-blue-500">
                            {stats.originalSize}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Original Size (B)
                          </div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-blue-500">
                            {stats.convertedSize}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Converted Size (B)
                          </div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-blue-500">
                            {(stats.ratio * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Size Ratio
                          </div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-semibold text-blue-500">
                            {stats.encoding}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Input Encoding
                          </div>
                        </Card>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-muted-foreground">
                    {mode === 'encode' ? 'Encoded Base64 will appear here' : 'Decoded text will appear here'}
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