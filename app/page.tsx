'use client'
import { useEffect, useState } from 'react'

type Project = {
  id: number
  name: string
  description?: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(false)

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async () => {
    if (!newProject.name) return

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        await fetchProjects() // Refresh the projects list
        setNewProject({ name: '', description: '' })
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProjects() // Refresh the projects list
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchProjects}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Project
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {projects.map(p => (
          <li key={p.id} className="border rounded p-3">
            <strong>{p.name}</strong><br />
            <span className="text-sm text-gray-600">{p.description}</span>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => handleDeleteProject(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for creating a new project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Project name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Project description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setNewProject({ name: '', description: '' })
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
