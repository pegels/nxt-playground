'use client'
import { useState, useCallback } from 'react';
import { Project, NewProject } from '../types';
import * as projectService from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectService.fetchProjects(showDeleted);
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showDeleted]);

  const createProject = async (projectData: NewProject): Promise<boolean> => {
    try {
      await projectService.createProject(projectData);
      await fetchProjects(); // Refresh the list
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProject = async (id: number, projectData: NewProject): Promise<boolean> => {
    try {
      await projectService.updateProject(id, projectData);
      await fetchProjects(); // Refresh the list
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteProject = async (id: number): Promise<boolean> => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return false;
    }

    try {
      await projectService.deleteProject(id);
      await fetchProjects(); // Refresh the list
      return true;
    } catch (error) {
      return false;
    }
  };

  const restoreProject = async (id: number): Promise<boolean> => {
    try {
      await projectService.restoreProject(id);
      await fetchProjects(); // Refresh the list
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    projects,
    isLoading,
    showDeleted,
    setShowDeleted,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    restoreProject
  };
}
