'use client'
import { useEffect, useState } from 'react'
import { AuditTable, AppButton, Modal, ProjectForm, ProjectList } from './components'
import { useProjectAudit, useProjectModal, useProjects } from '../hooks'
import { NewProject } from '../types'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)
  
  const { 
    projects, 
    isLoading, 
    showDeleted, 
    setShowDeleted, 
    fetchProjects, 
    createProject, 
    updateProject, 
    deleteProject, 
    restoreProject 
  } = useProjects()
  
  const { 
    auditData, 
    isLoading: isLoadingAudit, 
    fetchAuditData 
  } = useProjectAudit()
  
  const { 
    isModalOpen, 
    isEditMode, 
    currentProject, 
    openCreateModal, 
    openEditModal, 
    closeModal 
  } = useProjectModal()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateOrUpdateProject = async (projectData: NewProject) => {
    setIsSubmitting(true)
    
    try {
      let success
      
      if (isEditMode && currentProject) {
        success = await updateProject(currentProject.id, projectData)
      } else {
        success = await createProject(projectData)
      }
      
      if (success) {
        closeModal()
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleViewAudit = async (projectId: number) => {
    const success = await fetchAuditData(projectId)
    if (success) {
      setIsAuditModalOpen(true)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Project Manager
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your projects efficiently with our simple and intuitive interface.
            Create, edit, and track changes to your projects all in one place.
          </p>
        </div>
        
        {/* Controls section */}
        <div className="bg-card rounded-lg shadow-sm border p-5 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Show deleted projects</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <AppButton
                onClick={fetchProjects}
                disabled={isLoading}
                variant="outline"
                isLoading={isLoading}
                className="text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
                Refresh
              </AppButton>
              <AppButton
                onClick={openCreateModal}
                variant="default"
                className="text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                New Project
              </AppButton>
            </div>
          </div>
        </div>

        {/* Project list section */}
        <div className="bg-card rounded-lg shadow-sm border p-5">
          <h2 className="text-xl font-medium mb-4">Projects</h2>
          
          <ProjectList
            projects={projects}
            onViewAudit={handleViewAudit}
            onEdit={openEditModal}
            onDelete={deleteProject}
            onRestore={restoreProject}
          />
        </div>

      {/* Project form modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen}
          title={isEditMode ? 'Edit Project' : 'Create New Project'}
          onClose={closeModal}
        >
          <ProjectForm
            initialData={currentProject || undefined}
            onSubmit={handleCreateOrUpdateProject}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Project audit modal */}
      {isAuditModalOpen && (
        <Modal 
          isOpen={isAuditModalOpen}
          title="Project Change History"
          maxWidth="3xl"
          onClose={() => setIsAuditModalOpen(false)}
        >
          <AuditTable 
            auditData={auditData} 
            isLoading={isLoadingAudit} 
          />
          <div className="flex justify-end space-x-2 mt-4">
            <AppButton 
              variant="outline"
              onClick={() => setIsAuditModalOpen(false)}
            >
              Close
            </AppButton>
          </div>
        </Modal>
      )}
    </div>
  </main>
  )
}
