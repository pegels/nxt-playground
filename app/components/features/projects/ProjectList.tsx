'use client'
import { Project } from '../../../../types';
import { AppButton } from '../../common/AppButton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../ui/card';
import { Badge } from '../../ui/badge';

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
  if (projects.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-3">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p className="text-muted-foreground">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">Create a new project to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map(project => (
        <Card 
          key={project.id} 
          className={`transition-all hover:shadow-md ${project.isDeleted ? 'border-destructive/30 bg-destructive/5' : ''}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="truncate">{project.name}</CardTitle>
              {project.isDeleted && (
                <Badge variant="destructive" className="ml-2">
                  Deleted
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          
          <CardFooter className="flex flex-wrap items-center gap-2 justify-end pt-2">
            <AppButton 
              variant="secondary" 
              size="sm" 
              onClick={() => onViewAudit(project.id)}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              History
            </AppButton>
            
            {!project.isDeleted ? (
              <>
                <AppButton variant="outline" size="sm" onClick={() => onEdit(project)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </AppButton>
                <AppButton variant="destructive" size="sm" onClick={() => onDelete(project.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  Delete
                </AppButton>
              </>
            ) : (
              <AppButton variant="outline" size="sm" onClick={() => onRestore(project.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
                Restore
              </AppButton>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
