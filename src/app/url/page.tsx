'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Link, Copy, Info, ChevronDown, ExternalLink } from 'lucide-react'

interface URLInfo {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  searchParams: Record<string, string>
  isValid: boolean
}

const commonExamples = [
  {
    description: 'Simple URL',
    url: 'https://www.example.com/path?query=value#section'
  },
  {
    description: 'URL with Authentication',
    url: 'https://user:pass@api.example.com:8080/v1/data'
  },
  {
    description: 'Complex Query Parameters',
    url: 'https://search.example.com/results?q=test&page=1&sort=desc&filter[]=one&filter[]=two'
  }
]

export default function URLParser() {
  const [input, setInput] = useState('https://www.example.com/path?query=value#section')
  const [urlInfo, setUrlInfo] = useState<URLInfo | null>(null)
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseURL = (urlString: string) => {
    try {
      const url = new URL(urlString)
      
      // Extract search params
      const searchParams: Record<string, string> = {}
      url.searchParams.forEach((value, key) => {
        searchParams[key] = value
      })

      setUrlInfo({
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        searchParams,
        isValid: true
      })
      setError(null)
    } catch (err) {
      setError('Invalid URL format')
      setUrlInfo(null)
    }
  }

  // Initialize URL parsing when component mounts
  useEffect(() => {
    parseURL(input)
  }, [])

  const handleInputChange = (value: string) => {
    setInput(value)
    parseURL(value)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex-1">
      <main className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3 text-pink-500">
            <Link size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">URL Parser</h1>
          </div>

          {/* Instructions Card */}
          <Card className="p-4" hasGlow>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-pink-500">
                  <Info size={16} />
                  <h2 className="text-base font-semibold">How to Use</h2>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-pink-500 transition-transform duration-200 ${
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
                      1. Enter a URL to parse its components<br />
                      2. View detailed URL information and structure<br />
                      3. Analyze query parameters and fragments<br />
                      4. Copy individual components as needed
                    </p>
                  </div>
                  <div className="border-t border-pink-500/20 pt-4">
                    <h3 className="text-base font-semibold text-pink-500 mb-3">Example URLs</h3>
                    <div className="grid gap-2">
                      {commonExamples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="group p-3 rounded-md bg-background/50 hover:bg-pink-500/5 transition-colors cursor-pointer"
                          onClick={() => handleInputChange(example.url)}
                        >
                          <div className="flex items-center gap-3">
                            <ExternalLink size={16} className="text-pink-500" />
                            <div>
                              <div className="text-sm text-pink-500">{example.description}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {example.url}
                              </div>
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
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground/90">URL Input</h2>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full bg-background/50 rounded-md p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  placeholder="Enter URL (e.g., https://www.example.com)"
                />
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </Card>

            {/* URL Info Section */}
            {urlInfo && (
              <Card className="p-4" hasGlow>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground/90">URL Information</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-pink-500 hover:text-pink-400"
                    >
                      <Info size={14} className="mr-2" />
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {/* Basic URL Components */}
                    <div className="grid gap-2">
                      <URLComponent label="Protocol" value={urlInfo.protocol} onCopy={copyToClipboard} />
                      <URLComponent label="Hostname" value={urlInfo.hostname} onCopy={copyToClipboard} />
                      {urlInfo.port && (
                        <URLComponent label="Port" value={urlInfo.port} onCopy={copyToClipboard} />
                      )}
                      <URLComponent label="Path" value={urlInfo.pathname} onCopy={copyToClipboard} />
                    </div>

                    {showDetails && (
                      <>
                        <div className="border-t border-pink-500/20 pt-4">
                          {/* Authentication */}
                          {(urlInfo.username || urlInfo.password) && (
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-pink-500 mb-2">Authentication</h3>
                              <div className="grid gap-2">
                                {urlInfo.username && (
                                  <URLComponent label="Username" value={urlInfo.username} onCopy={copyToClipboard} />
                                )}
                                {urlInfo.password && (
                                  <URLComponent label="Password" value={urlInfo.password} onCopy={copyToClipboard} />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Query Parameters */}
                          {urlInfo.search && (
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-pink-500 mb-2">Query Parameters</h3>
                              <div className="grid gap-2">
                                <URLComponent label="Raw Query" value={urlInfo.search} onCopy={copyToClipboard} />
                                {Object.entries(urlInfo.searchParams).map(([key, value], idx) => (
                                  <URLComponent
                                    key={idx}
                                    label={key}
                                    value={value}
                                    onCopy={copyToClipboard}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Fragment */}
                          {urlInfo.hash && (
                            <div>
                              <h3 className="text-sm font-semibold text-pink-500 mb-2">Fragment</h3>
                              <URLComponent label="Hash" value={urlInfo.hash} onCopy={copyToClipboard} />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function URLComponent({ label, value, onCopy }: { label: string, value: string, onCopy: (text: string) => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono">{value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(value)}
          className="text-pink-500 hover:text-pink-400"
        >
          <Copy size={14} />
        </Button>
      </div>
    </div>
  )
} 