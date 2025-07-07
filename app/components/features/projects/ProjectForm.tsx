'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Project, NewProject } from '../../../../types';
import { AppButton } from '../../common/AppButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

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
  const isEditMode = !!initialData;
  
  const form = useForm<NewProject>({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ 
        name: initialData.name, 
        description: initialData.description || '' 
      });
    }
  }, [initialData, form.reset, form]);

  const handleSubmit = (data: NewProject) => {
    if (!data.name.trim()) return;
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Project name" 
                  {...field} 
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Project description" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <AppButton variant="outline" onClick={onCancel}>
            Cancel
          </AppButton>
          <AppButton 
            type="submit" 
            isLoading={isSubmitting}
            disabled={!form.watch('name')?.trim() || isSubmitting}
          >
            {isEditMode ? 'Update' : 'Create'}
          </AppButton>
        </div>
      </form>
    </Form>
  );
}
