'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Palette, Copy, Info, ChevronDown, Eye } from 'lucide-react'
import tinycolor from 'tinycolor2'

interface ColorInfo {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  name?: string
  isDark: boolean
  isLight: boolean
  brightness: number
  luminance: number
}

interface Palette {
  name: string
  colors: string[]
}

const commonExamples = [
  {
    description: 'Material Blue',
    color: '#2196F3',
  },
  {
    description: 'Emerald Green',
    color: '#4CAF50',
  },
  {
    description: 'Deep Purple',
    color: '#673AB7',
  }
]

const paletteTypes = [
  { name: 'Analogous', description: 'Colors adjacent on the color wheel' },
  { name: 'Monochromatic', description: 'Different shades of the same color' },
  { name: 'Triad', description: 'Three evenly spaced colors on the color wheel' },
  { name: 'Tetrad', description: 'Four evenly spaced colors on the color wheel' },
  { name: 'Split Complement', description: 'Base color and two adjacent to its complement' },
  { name: 'Complement', description: 'Base color and its opposite on the color wheel' }
]

export default function ColorTools() {
  const [input, setInput] = useState('#2196F3')
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null)
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false)
  const [showColorInfo, setShowColorInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeColor = (colorStr: string) => {
    try {
      const color = tinycolor(colorStr)
      if (!color.isValid()) {
        throw new Error('Invalid color format')
      }

      setColorInfo({
        hex: color.toHexString(),
        rgb: color.toRgbString(),
        hsl: color.toHslString(),
        hsv: color.toHsvString(),
        name: color.toName() || undefined,
        isDark: color.isDark(),
        isLight: color.isLight(),
        brightness: color.getBrightness(),
        luminance: color.getLuminance()
      })

      // Generate palettes
      const palettes: Palette[] = [
        {
          name: 'Analogous',
          colors: color.analogous().map((c: tinycolor.Instance) => c.toHexString())
        },
        {
          name: 'Monochromatic',
          colors: color.monochromatic().map((c: tinycolor.Instance) => c.toHexString())
        },
        {
          name: 'Triad',
          colors: color.triad().map((c: tinycolor.Instance) => c.toHexString())
        },
        {
          name: 'Tetrad',
          colors: color.tetrad().map((c: tinycolor.Instance) => c.toHexString())
        },
        {
          name: 'Split Complement',
          colors: color.splitcomplement().map((c: tinycolor.Instance) => c.toHexString())
        },
        {
          name: 'Complement',
          colors: [color.toHexString(), color.complement().toHexString()]
        }
      ]

      setPalettes(palettes)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid color')
      setColorInfo(null)
      setPalettes([])
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

  // Analyze color on input change
  const handleInputChange = (value: string) => {
    setInput(value)
    analyzeColor(value)
  }

  // Initialize color analysis when component mounts
  useEffect(() => {
    analyzeColor(input)
  }, []) // Empty dependency array means this runs once when component mounts

  return (
    <div className="flex-1">
      <main className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3 text-orange-500">
            <Palette size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">Color Tools</h1>
          </div>

          {/* Instructions Card */}
          <Card className="p-4" hasGlow>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-orange-500">
                  <Info size={16} />
                  <h2 className="text-base font-semibold">How to Use</h2>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-orange-500 transition-transform duration-200 ${
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
                      1. Enter a color in any format (HEX, RGB, HSL, name)<br />
                      2. View detailed color information and analysis<br />
                      3. Explore different color harmonies and palettes<br />
                      4. Click any color to copy its HEX code
                    </p>
                  </div>
                  <div className="border-t border-orange-500/20 pt-4">
                    <h3 className="text-base font-semibold text-orange-500 mb-3">Example Colors</h3>
                    <div className="grid gap-2">
                      {commonExamples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="group p-3 rounded-md bg-background/50 hover:bg-orange-500/5 transition-colors cursor-pointer"
                          onClick={() => handleInputChange(example.color)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-md shadow-sm" 
                              style={{ backgroundColor: example.color }}
                            />
                            <div>
                              <div className="text-sm text-orange-500">{example.description}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {example.color}
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
                  <h2 className="text-lg font-semibold text-foreground/90">Color Input</h2>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="flex-grow bg-background/50 rounded-md p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Enter color (e.g., #2196F3, rgb(33,150,243), blue)"
                  />
                  <input
                    type="color"
                    value={colorInfo?.hex || input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer bg-background/50 border-2 border-orange-500/20"
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </Card>

            {/* Color Info Section */}
            {colorInfo && (
              <Card className="p-4" hasGlow>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground/90">Color Information</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowColorInfo(!showColorInfo)}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      <Eye size={14} className="mr-2" />
                      {showColorInfo ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-16 h-16 rounded-md shadow-sm" 
                        style={{ backgroundColor: colorInfo.hex }}
                      />
                      <div className="grid gap-1">
                        <ColorFormat label="HEX" value={colorInfo.hex} onCopy={copyToClipboard} />
                      </div>
                    </div>
                    {showColorInfo && (
                      <>
                        <div className="grid gap-1 pt-3 border-t border-orange-500/20">
                          {colorInfo.name && (
                            <div className="text-sm text-muted-foreground">
                              Name: <span className="font-mono">{colorInfo.name}</span>
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Type: {colorInfo.isDark ? 'Dark' : 'Light'} color
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Brightness: {Math.round(colorInfo.brightness)} / 255
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Luminance: {colorInfo.luminance.toFixed(3)}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <ColorFormat label="RGB" value={colorInfo.rgb} onCopy={copyToClipboard} />
                          <ColorFormat label="HSL" value={colorInfo.hsl} onCopy={copyToClipboard} />
                          <ColorFormat label="HSV" value={colorInfo.hsv} onCopy={copyToClipboard} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Palettes Section */}
          {colorInfo && (
            <div className="grid gap-6">
              <h2 className="text-lg font-semibold text-foreground/90">Color Harmonies</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {palettes.map((palette, idx) => (
                  <Card key={idx} className="p-4" hasGlow>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground/90">{palette.name}</h3>
                        <div className="text-xs text-muted-foreground">
                          {paletteTypes.find(p => p.name === palette.name)?.description}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {palette.colors.map((color, colorIdx) => (
                          <button
                            key={colorIdx}
                            onClick={() => copyToClipboard(color)}
                            className="group flex items-center gap-3 p-2 rounded-md hover:bg-orange-500/5 transition-colors"
                          >
                            <div 
                              className="w-8 h-8 rounded-md shadow-sm" 
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-mono text-sm text-muted-foreground group-hover:text-orange-500">
                              {color}
                            </span>
                            <Copy size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-orange-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ColorFormat({ label, value, onCopy }: { label: string, value: string, onCopy: (text: string) => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono">{value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(value)}
          className="text-orange-500 hover:text-orange-400"
        >
          <Copy size={14} />
        </Button>
      </div>
    </div>
  )
} 