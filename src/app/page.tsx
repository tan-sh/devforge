import { Card } from '@/components/ui/Card'
import { Code2, FileJson, Regex, Palette, Link2 } from 'lucide-react'
import Link from 'next/link'

const tools = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and analyze JSON data with syntax highlighting',
    icon: FileJson,
    href: '/json',
    color: 'text-emerald-500',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    title: 'Base64 Converter',
    description: 'Encode and decode Base64 strings with support for various formats',
    icon: Code2,
    href: '/base64',
    color: 'text-blue-500',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'RegEx Tester',
    description: 'Test and debug regular expressions with real-time matching',
    icon: Regex,
    href: '/regex',
    color: 'text-purple-500',
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    title: 'Color Tools',
    description: 'Convert between color formats and generate palettes',
    icon: Palette,
    href: '/color',
    color: 'text-orange-500',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    title: 'URL Parser',
    description: 'Parse and build URLs with query parameter handling',
    icon: Link2,
    href: '/url',
    color: 'text-pink-500',
    gradient: 'from-pink-600 to-rose-600',
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen w-full py-24 px-4 overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial-top from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial-bottom from-accent/5 via-transparent to-transparent" />
        <div className="cyber-grid opacity-25" />
      </div>
      
      <section className="container mx-auto mb-24 text-center">
        <div className="relative inline-block animate-fade-down">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-text-shimmer bg-clip-text text-transparent">
            DevForge
          </h1>
          <div className="absolute -inset-x-6 -inset-y-4 bg-primary/10 blur-2xl -z-10" />
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up [animation-delay:150ms]">
          Your all-in-one developer toolkit for the modern web
        </p>
      </section>

      <section className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group"
            >
              <Card
                variant="glass"
                hasPattern
                hasGlow
                interactive
                className="animate-scale-up h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full">
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-20 blur-xl`} />
                  </div>
                  
                  <div className="relative flex flex-col h-full p-6">
                    <div className={`${tool.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <tool.icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground/90">{tool.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">
                      {tool.description}
                    </p>
                    <div className="text-sm font-medium text-foreground/80 group-hover:text-foreground flex items-center">
                      Try Now
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
