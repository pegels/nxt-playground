'use client'
import { useEffect, useState } from 'react'
import { AuditTable, AppButton, Modal, ProjectForm, ProjectList } from './components'
import { useProjectAudit, useProjectModal, useProjects } from '../hooks'
import { NewProject } from '../types'
import { Checkbox } from './components/ui/checkbox'
import { RefreshCw, Plus } from 'lucide-react'

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
              <div className="flex items-center space-x-2 bg-muted/30 px-3 py-2 rounded-md border border-border/40 hover:border-border transition-colors">
                <Checkbox 
                  id="show-deleted"
                  checked={showDeleted}
                  onCheckedChange={(checked: boolean | "indeterminate") => setShowDeleted(checked === true)}
                />
                <label
                  htmlFor="show-deleted"
                  className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show deleted projects
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AppButton
                onClick={fetchProjects}
                disabled={isLoading}
                variant="outline"
                isLoading={isLoading}
                className="text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </AppButton>
              <AppButton
                onClick={openCreateModal}
                variant="default"
                className="text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
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
