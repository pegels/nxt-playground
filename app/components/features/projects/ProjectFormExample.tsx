'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Checkbox } from "../../ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { useState } from "react"

// Define the form schema with Zod
const projectFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Project name must be at least 2 characters." })
    .max(50, { message: "Project name must not exceed 50 characters." }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  category: z.string({
    required_error: "Please select a project category.",
  }),
  isPublic: z.boolean().default(false),
})

// Define the form's type from the schema
type ProjectFormValues = z.infer<typeof projectFormSchema>

// Default values for the form
const defaultValues: Partial<ProjectFormValues> = {
  name: "",
  description: "",
  category: "",
  isPublic: false,
}

interface ProjectFormExampleProps {
  initialData?: Partial<ProjectFormValues>
  onSubmit: (data: ProjectFormValues) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProjectFormExample({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProjectFormExampleProps) {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  
  // Create form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  })

  // Handle form submission
  const handleSubmit = async (values: ProjectFormValues) => {
    setFormState("submitting")
    try {
      await Promise.resolve(onSubmit(values))
      setFormState("success")
    } catch (error) {
      setFormState("error")
      // You could handle the error here
      console.error("Form submission error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your project as it will appear in the dashboard.
              </FormDescription>
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
                  placeholder="Describe your project"
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of your project's goals and scope.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the category that best describes your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Public Project</FormLabel>
                <FormDescription>
                  Make this project visible to everyone.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || formState === "submitting"}
          >
            {isSubmitting || formState === "submitting" ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
