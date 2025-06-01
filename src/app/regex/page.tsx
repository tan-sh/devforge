'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Regex, Copy, Settings2, Info, ChevronDown } from 'lucide-react'

interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

interface Match {
  text: string
  index: number
  length: number
  groups?: { [key: string]: string }
}

const commonExamples = [
  {
    pattern: '\\w+',
    description: 'Find words',
    example: 'Hello, world! This is a test.',
  },
  {
    pattern: '\\d+',
    description: 'Find numbers',
    example: 'I have 42 apples and 15 oranges',
  },
  {
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Find email addresses',
    example: 'Contact me at john@example.com or support@test.com',
  },
  {
    pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
    description: 'Find IP addresses',
    example: 'Server IPs: 192.168.1.1 and 10.0.0.1',
  },
  {
    pattern: '\\b(https?://)?[\\w-]+\\.[\\w.-]+\\b',
    description: 'Find URLs',
    example: 'Visit https://example.com or www.test.com',
  },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  })
  const [input, setInput] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFlags, setShowFlags] = useState(false)
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false)

  const getFlagString = () => {
    let flagStr = ''
    if (flags.global) flagStr += 'g'
    if (flags.ignoreCase) flagStr += 'i'
    if (flags.multiline) flagStr += 'm'
    if (flags.dotAll) flagStr += 's'
    if (flags.unicode) flagStr += 'u'
    if (flags.sticky) flagStr += 'y'
    return flagStr
  }

  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
  }

  const findMatches = () => {
    if (!pattern || !input) {
      setMatches([])
      setError(null)
      return
    }

    try {
      const regex = new RegExp(pattern, getFlagString())
      const matches: Match[] = []
      
      if (flags.global) {
        let match
        while ((match = regex.exec(input)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.groups
          })
        }
      } else {
        const match = regex.exec(input)
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.groups
          })
        }
      }

      setMatches(matches)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regular expression')
      setMatches([])
    }
  }

  // Update matches whenever pattern, input, or flags change
  useEffect(() => {
    findMatches()
  }, [pattern, input, flags])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getHighlightedText = () => {
    if (!input || matches.length === 0) return input

    let result = []
    let lastIndex = 0

    matches.forEach((match, idx) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(
          <span key={`text-${idx}`} className="text-foreground/80">
            {input.slice(lastIndex, match.index)}
          </span>
        )
      }

      // Add highlighted match
      result.push(
        <span 
          key={`match-${idx}`}
          className="bg-purple-500/20 text-purple-400 rounded px-0.5"
          title={match.groups ? `Groups: ${JSON.stringify(match.groups, null, 2)}` : undefined}
        >
          {match.text}
        </span>
      )

      lastIndex = match.index + match.length
    })

    // Add remaining text
    if (lastIndex < input.length) {
      result.push(
        <span key="text-end" className="text-foreground/80">
          {input.slice(lastIndex)}
        </span>
      )
    }

    return result
  }

  const loadExample = (pattern: string, input: string) => {
    setPattern(pattern)
    setInput(input)
  }

  return (
    <div className="flex-1">
      <main className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3 text-purple-500">
            <Regex size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">RegEx Tester</h1>
          </div>

          {/* Instructions Card */}
          <Card className="p-4" hasGlow>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-purple-500">
                  <Info size={16} />
                  <h2 className="text-base font-semibold">How to Use</h2>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-purple-500 transition-transform duration-200 ${
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
                      1. Enter a regex pattern in the Pattern field (e.g., <code className="text-purple-400">\w+</code> for words)<br />
                      2. Enter your test text in the Test String field<br />
                      3. Matches will be highlighted automatically<br />
                      4. Use the gear icon (⚙️) to toggle regex flags like case-insensitive matching
                    </p>
                  </div>
                  <div className="border-t border-purple-500/20 pt-4">
                    <h3 className="text-base font-semibold text-purple-500 mb-3">Common Examples</h3>
                    <div className="grid gap-2">
                      {commonExamples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="group p-3 rounded-md bg-background/50 hover:bg-purple-500/5 transition-colors cursor-pointer"
                          onClick={() => loadExample(example.pattern, example.example)}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-purple-400 text-sm">{example.pattern}</span>
                            <span className="text-sm text-purple-500">{example.description}</span>
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            Example: {example.example}
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
            <div className="flex flex-col gap-6">
              <Card className="p-4" hasGlow>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground/90">Pattern</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFlags(!showFlags)}
                        className="text-purple-500 hover:text-purple-400"
                        title="Toggle flags"
                      >
                        <Settings2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pattern)}
                        className="text-purple-500 hover:text-purple-400"
                        title="Copy pattern"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-500">
                      /
                    </div>
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full bg-background/50 rounded-md py-2 pl-6 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Enter regex pattern..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-purple-500">
                      /{getFlagString()}
                    </div>
                  </div>
                  {showFlags && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                      <Button
                        variant={flags.global ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('global')}
                        className={flags.global ? 'border-purple-500 text-purple-500' : ''}
                      >
                        global (g)
                      </Button>
                      <Button
                        variant={flags.ignoreCase ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('ignoreCase')}
                        className={flags.ignoreCase ? 'border-purple-500 text-purple-500' : ''}
                      >
                        ignore case (i)
                      </Button>
                      <Button
                        variant={flags.multiline ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('multiline')}
                        className={flags.multiline ? 'border-purple-500 text-purple-500' : ''}
                      >
                        multiline (m)
                      </Button>
                      <Button
                        variant={flags.dotAll ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('dotAll')}
                        className={flags.dotAll ? 'border-purple-500 text-purple-500' : ''}
                      >
                        dot all (s)
                      </Button>
                      <Button
                        variant={flags.unicode ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('unicode')}
                        className={flags.unicode ? 'border-purple-500 text-purple-500' : ''}
                      >
                        unicode (u)
                      </Button>
                      <Button
                        variant={flags.sticky ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => toggleFlag('sticky')}
                        className={flags.sticky ? 'border-purple-500 text-purple-500' : ''}
                      >
                        sticky (y)
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4" hasGlow>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground/90">Test String</h2>
                  </div>
                  <textarea
                    className="w-full min-h-[200px] bg-background/50 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to test against..."
                  />
                </div>
              </Card>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
              <Card className="p-4" hasGlow>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground/90">Matches</h2>
                    <div className="text-sm text-purple-500">
                      {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                    </div>
                  </div>
                  
                  {error ? (
                    <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500">
                      {error}
                    </div>
                  ) : matches.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-background/50 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                        {getHighlightedText()}
                      </div>
                      <div className="grid gap-2">
                        {matches.map((match, idx) => (
                          <div 
                            key={idx}
                            className="p-2 rounded-md bg-background/50 text-sm"
                          >
                            <div className="flex items-center justify-between text-purple-500">
                              <span>Match {idx + 1}</span>
                              <span>Index: {match.index}</span>
                            </div>
                            <div className="font-mono mt-1">{match.text}</div>
                            {match.groups && Object.keys(match.groups).length > 0 && (
                              <div className="mt-2 pt-2 border-t border-purple-500/20">
                                <div className="text-xs text-purple-500 mb-1">Groups:</div>
                                {Object.entries(match.groups).map(([name, value]) => (
                                  <div key={name} className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-purple-400">{name}:</span>
                                    <span className="font-mono">{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : input ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      No matches found
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      Enter a pattern and test string to see matches
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4" hasGlow>
                <div className="flex items-center gap-2 text-purple-500">
                  <Info size={16} />
                  <h2 className="text-sm font-semibold">Quick Reference</h2>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-mono text-purple-400">.</div>
                    <div className="text-muted-foreground">Any character</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">^</div>
                    <div className="text-muted-foreground">Start of line</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">$</div>
                    <div className="text-muted-foreground">End of line</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">\w</div>
                    <div className="text-muted-foreground">Word character</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">\d</div>
                    <div className="text-muted-foreground">Digit</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">\s</div>
                    <div className="text-muted-foreground">Whitespace</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">[abc]</div>
                    <div className="text-muted-foreground">Character class</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">a*</div>
                    <div className="text-muted-foreground">0 or more</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">a+</div>
                    <div className="text-muted-foreground">1 or more</div>
                  </div>
                  <div>
                    <div className="font-mono text-purple-400">a?</div>
                    <div className="text-muted-foreground">0 or 1</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 