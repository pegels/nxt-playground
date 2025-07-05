export type Project = {
  id: number
  name: string
  description?: string
  createdAt?: Date
  isDeleted?: boolean
}

export type ProjectAudit = {
  id: number
  projectId: number
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE'
  name: string
  description?: string
  performedAt: Date
}

export type NewProject = {
  name: string
  description: string
}
