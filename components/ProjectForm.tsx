'use client'
import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Project, NewProject } from '../types';

type ProjectFormProps = {
  initialData?: Project;
  onSubmit: (data: NewProject) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function ProjectForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: ProjectFormProps) {
  const [formData, setFormData] = useState<NewProject>({ name: '', description: '' });
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        name: initialData.name, 
        description: initialData.description || '' 
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Project name"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Project description"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          disabled={!formData.name.trim() || isSubmitting}
        >
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
