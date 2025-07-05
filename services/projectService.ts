import { Project, ProjectAudit, NewProject } from '../types';

export async function fetchProjects(includeDeleted: boolean = true): Promise<Project[]> {
  try {
    const response = await fetch(`/api/projects${includeDeleted ? '?includeDeleted=true' : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function createProject(projectData: NewProject): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(id: number, projectData: NewProject): Promise<Project> {
  try {
    const response = await fetch(`/api/projects?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/projects?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function restoreProject(id: number): Promise<Project> {
  try {
    const response = await fetch(`/api/projects?id=${id}&restore=true`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to restore project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error restoring project:', error);
    throw error;
  }
}

export async function fetchProjectAudit(projectId: number): Promise<{ data: ProjectAudit[], pagination: any }> {
  try {
    const response = await fetch(`/api/audit?projectId=${projectId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching audit data:', error);
    throw error;
  }
}
