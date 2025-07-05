'use client'
import { useState } from 'react';
import { Project, NewProject } from '../types';

export function useProjectModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const openCreateModal = () => {
    setCurrentProject(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setCurrentProject(project);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  return {
    isModalOpen,
    isEditMode,
    currentProject,
    openCreateModal,
    openEditModal,
    closeModal
  };
}
