'use client'
import { ProjectAudit } from '../../../../types';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell 
} from '../../ui/table';
import { Spinner } from '../../common/Spinner';

type AuditTableProps = {
  auditData: ProjectAudit[];
  isLoading: boolean;
};

export function AuditTable({ auditData, isLoading }: AuditTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner color="text-muted-foreground" />
      </div>
    );
  }

  if (auditData.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No changes found for this project.</p>;
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditData.map(audit => {
            // Determine action color
            const actionColor = 
              audit.action === 'CREATE' ? 'text-green-600' :
              audit.action === 'UPDATE' ? 'text-blue-600' :
              audit.action === 'DELETE' ? 'text-red-600' :
              audit.action === 'RESTORE' ? 'text-purple-600' : '';
              
            return (
              <TableRow key={audit.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(audit.performedAt).toLocaleString()}
                </TableCell>
                <TableCell className={`font-medium ${actionColor}`}>
                  {audit.action}
                </TableCell>
                <TableCell>
                  {audit.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {audit.description || '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
