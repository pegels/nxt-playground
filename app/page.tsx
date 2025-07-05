'use client'
import { useEffect, useState } from 'react'

type Project = {
  id: number
  name: string
  description?: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects)
  }, [])

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ul className="space-y-2">
        {projects.map(p => (
          <li key={p.id} className="border rounded p-3">
            <strong>{p.name}</strong><br />
            <span className="text-sm text-gray-600">{p.description}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
