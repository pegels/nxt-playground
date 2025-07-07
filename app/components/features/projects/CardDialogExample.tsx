'use client'

import { useState } from 'react'
import { Button } from "../../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'completed' | 'paused'
  lastUpdated: string
}

const projectsData: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    status: 'active',
    lastUpdated: "2 days ago"
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Develop a new mobile application for our customers",
    status: 'paused',
    lastUpdated: "1 week ago"
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Plan and execute Q3 marketing campaign",
    status: 'completed',
    lastUpdated: "2 months ago"
  }
]

export function CardDialogExample() {
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
      case 'paused':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{project.name}</CardTitle>
              <span 
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <CardDescription>Last updated: {project.lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedProject(project)}
                >
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Project Details</DialogTitle>
                  <DialogDescription>
                    View and manage project information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={selectedProject?.name}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Input
                      id="status"
                      defaultValue={selectedProject?.status}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      defaultValue={selectedProject?.description}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button">Edit Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">Edit</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
