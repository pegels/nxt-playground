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
const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  category: z.string().min(1, {
    message: "Please select a project category.",
  }),
  isPublic: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

const defaultValues: Partial<FormData> = {
  name: "",
  description: "",
  category: "",
  isPublic: false,
}

interface ShadcnProjectFormProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ShadcnProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ShadcnProjectFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  })

  async function handleSubmit(data: FormData) {
    setIsProcessing(true)
    try {
      await Promise.resolve(onSubmit(data))
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsProcessing(false)
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
            disabled={isSubmitting || isProcessing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isProcessing}
          >
            {isSubmitting || isProcessing ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
