'use client'

import { SimpleFormExample } from '../components/features/projects/SimpleFormExample'
import { CardDialogExample } from '../components/features/projects/CardDialogExample'

export default function FormExamplesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Shadcn UI Components
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Examples of components implemented using shadcn UI
          </p>
        </div>
        
        {/* Card and Dialog section */}
        <div className="bg-card rounded-lg shadow-sm border p-5 mb-8">
          <h2 className="text-xl font-medium mb-4">Card and Dialog Examples</h2>
          <CardDialogExample />
        </div>
        
        {/* Form section */}
        <div className="bg-card rounded-lg shadow-sm border p-5 mb-8">
          <h2 className="text-xl font-medium mb-4">Form Components Example</h2>
          <SimpleFormExample />
        </div>
      </div>
    </main>
  )
}
