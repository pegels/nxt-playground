'use client'
import { useEffect, useState } from 'react'

type Project = {
  id: number
  name: string
  description?: string
  createdAt?: Date
  isDeleted?: boolean
}

type ProjectAudit = {
  id: number
  projectId: number
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  name: string
  description?: string
  performedAt: Date
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)
  const [projectAuditData, setProjectAuditData] = useState<ProjectAudit[]>([])
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)
  const [showDeleted, setShowDeleted] = useState(true) // New state to track whether to show deleted projects

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects${showDeleted ? '?includeDeleted=true' : ''}`)
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
  }, [showDeleted])

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

  const handleRestoreProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects?id=${id}&restore=true`, {
        method: 'PUT',
      })

      if (response.ok) {
        await fetchProjects() // Refresh the projects list
      }
    } catch (error) {
      console.error('Failed to restore project:', error)
    }
  }

  const openEditModal = (project: Project) => {
    setCurrentProject(project)
    setNewProject({ name: project.name, description: project.description || '' })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleUpdateProject = async () => {
    if (!currentProject || !newProject.name) return

    try {
      const response = await fetch(`/api/projects?id=${currentProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        await fetchProjects() // Refresh the projects list
        setNewProject({ name: '', description: '' })
        setIsModalOpen(false)
        setIsEditMode(false)
        setCurrentProject(null)
      }
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const fetchProjectAudit = async (projectId: number) => {
    setIsLoadingAudit(true)
    setCurrentProject(projects.find(p => p.id === projectId) || null)
    try {
      const response = await fetch(`/api/audit?projectId=${projectId}`)
      const data = await response.json()
      setProjectAuditData(data.data)
      setIsAuditModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch audit data:', error)
    } finally {
      setIsLoadingAudit(false)
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center space-x-2">
          <label className="flex items-center mr-4 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => {
                setShowDeleted(e.target.checked);
                fetchProjects();
              }}
              className="mr-2"
            />
            <span>Show deleted</span>
          </label>
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
            onClick={() => {
              setIsEditMode(false)
              setCurrentProject(null)
              setNewProject({ name: '', description: '' })
              setIsModalOpen(true)
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Project
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {projects.map(p => (
          <li key={p.id} className={`border rounded p-3 ${p.isDeleted ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex justify-between">
              <div>
                <strong>{p.name}</strong>{p.isDeleted && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Deleted</span>}<br />
                <span className="text-sm text-gray-600">{p.description}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => fetchProjectAudit(p.id)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm rounded flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                View Changes
              </button>
              {!p.isDeleted && (
                <>
                  <button
                    onClick={() => openEditModal(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </>
              )}
              {p.isDeleted && (
                <button
                  onClick={() => handleRestoreProject(p.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                >
                  Restore
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for creating or editing a project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>
            
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
                  setIsEditMode(false)
                  setCurrentProject(null)
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateProject : handleCreateProject}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for project audit data */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Project Change History</h2>
            
            {isLoadingAudit ? (
              <div className="flex justify-center py-4">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {projectAuditData.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No changes found for this project.</p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">Action</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectAuditData.map(audit => {
                        // Determine action color
                        const actionColor = 
                          audit.action === 'CREATE' ? 'text-green-600' :
                          audit.action === 'UPDATE' ? 'text-blue-600' :
                          audit.action === 'DELETE' ? 'text-red-600' : '';
                          
                        return (
                          <tr key={audit.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(audit.performedAt).toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 font-medium ${actionColor}`}>
                              {audit.action}
                            </td>
                            <td className="px-4 py-3">
                              {audit.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {audit.description || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
