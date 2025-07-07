'use client'
import { Project } from '../../../../types';
import { AppButton } from '../../common/AppButton';

type ProjectListProps = {
  projects: Project[];
  onViewAudit: (id: number) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
};

export function ProjectList({ 
  projects, 
  onViewAudit, 
  onEdit, 
  onDelete,
  onRestore 
}: ProjectListProps) {
  return (
    <ul className="space-y-2">
      {projects.map(project => (
        <li key={project.id} className={`border rounded p-3 ${project.isDeleted ? 'bg-red-50 border-red-200' : ''}`}>
          <div className="flex justify-between">
            <div>
              <strong>{project.name}</strong>
              {project.isDeleted && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Deleted</span>}
              <br />
              <span className="text-sm text-gray-600">{project.description}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <AppButton 
              variant="secondary" 
              size="sm" 
              onClick={() => onViewAudit(project.id)}
              className="flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              View Changes
            </AppButton>
            
            {!project.isDeleted ? (
              <>
                <AppButton variant="default" size="sm" onClick={() => onEdit(project)}>
                  Edit
                </AppButton>
                <AppButton variant="destructive" size="sm" onClick={() => onDelete(project.id)}>
                  Delete
                </AppButton>
              </>
            ) : (
              <AppButton variant="outline" size="sm" onClick={() => onRestore(project.id)}>
                Restore
              </AppButton>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
