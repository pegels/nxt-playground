'use client'
import { useState, useCallback } from 'react';
import { ProjectAudit } from '../types';
import * as projectService from '../services/projectService';

export function useProjectAudit() {
  const [auditData, setAuditData] = useState<ProjectAudit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

  const fetchAuditData = useCallback(async (projectId: number) => {
    setIsLoading(true);
    setCurrentProjectId(projectId);
    try {
      const response = await projectService.fetchProjectAudit(projectId);
      setAuditData(response.data);
      return true;
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    auditData,
    isLoading,
    currentProjectId,
    fetchAuditData
  };
}
