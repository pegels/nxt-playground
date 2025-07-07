'use client'

import React from 'react'
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Checkbox } from "../../ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"

export function SimpleFormExample() {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: '',
    isPublic: false,
  })
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublic: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter project name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <p className="text-sm text-muted-foreground">
          The name of your project as it will appear in the dashboard.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your project"
          className="min-h-[120px]"
          value={formData.description}
          onChange={handleInputChange}
        />
        <p className="text-sm text-muted-foreground">
          A brief description of your project's goals and scope.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Select the category that best describes your project.
        </p>
      </div>
      
      <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id="isPublic"
          checked={formData.isPublic}
          onCheckedChange={handleCheckboxChange}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="isPublic">Public Project</Label>
          <p className="text-sm text-muted-foreground">
            Make this project visible to everyone.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          variant="outline" 
          type="button"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </Button>
      </div>
    </form>
  )
}
