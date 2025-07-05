'use client'
import { ProjectAudit } from '../types';

type AuditTableProps = {
  auditData: ProjectAudit[];
  isLoading: boolean;
};

export function AuditTable({ auditData, isLoading }: AuditTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (auditData.length === 0) {
    return <p className="text-center text-gray-500 py-4">No changes found for this project.</p>;
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Action</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map(audit => {
            // Determine action color
            const actionColor = 
              audit.action === 'CREATE' ? 'text-green-600' :
              audit.action === 'UPDATE' ? 'text-blue-600' :
              audit.action === 'DELETE' ? 'text-red-600' :
              audit.action === 'RESTORE' ? 'text-purple-600' : '';
              
            return (
              <tr key={audit.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(audit.performedAt).toLocaleString()}
                </td>
                <td className={`px-4 py-3 font-medium ${actionColor}`}>
                  {audit.action}
                </td>
                <td className="px-4 py-3">
                  {audit.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {audit.description || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
