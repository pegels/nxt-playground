'use client'
import { useEffect, useState } from 'react'
import { AuditTable, Button, Modal, ProjectForm, ProjectList } from '../components'
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
    <main className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center space-x-2">
          <label className="flex items-center mr-4 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="mr-2"
            />
            <span>Show deleted</span>
          </label>
          <Button
            onClick={fetchProjects}
            disabled={isLoading}
            variant="success"
            isLoading={isLoading}
          >
            Refresh Data
          </Button>
          <Button
            onClick={openCreateModal}
            variant="primary"
          >
            New Project
          </Button>
        </div>
      </div>
      
      <ProjectList
        projects={projects}
        onViewAudit={handleViewAudit}
        onEdit={openEditModal}
        onDelete={deleteProject}
        onRestore={restoreProject}
      />

      {/* Project form modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen}
          title={isEditMode ? 'Edit Project' : 'Create New Project'}
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
        >
          <AuditTable 
            auditData={auditData} 
            isLoading={isLoadingAudit} 
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => setIsAuditModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </main>
  )
}
