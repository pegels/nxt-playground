import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const config = {
  regions: ['fra1'] // EU region for serverless execution
}

export async function GET() {
  const projects = await prisma.project.findMany()
  return Response.json(projects)
}

export async function POST(req: Request) {
  const data = await req.json()
  
  try {
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the project
      const project = await tx.project.create({ data })
      
      // Create audit log
      await tx.projectAudit.create({
        data: {
          projectId: project.id,
          action: 'CREATE',
          name: project.name,
          description: project.description
        }
      })
      
      return project
    })
    
    return Response.json(result)
  } catch (error) {
    console.error('Error creating project:', error)
    return new Response(JSON.stringify({ error: 'Failed to create project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return new Response('Project ID is required', { status: 400 })
  }
  
  try {
    const data = await req.json()
    const projectId = parseInt(id)
    
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Get the project before update for audit purposes
      const oldProject = await tx.project.findUnique({
        where: { id: projectId }
      })
      
      if (!oldProject) {
        throw new Error('Project not found')
      }
      
      // Update the project
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data
      })
      
      // Create audit log
      await tx.projectAudit.create({
        data: {
          projectId: updatedProject.id,
          action: 'UPDATE',
          name: updatedProject.name,
          description: updatedProject.description
        }
      })
      
      return updatedProject
    })
    
    return Response.json(result)
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof Error && error.message === 'Project not found') {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return new Response('Project ID is required', { status: 400 })
  }
  
  try {
    const projectId = parseInt(id)
    
    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Get the project before deletion for audit purposes
      const project = await tx.project.findUnique({
        where: { id: projectId }
      })
      
      if (!project) {
        throw new Error('Project not found')
      }
      
      // Delete the project
      await tx.project.delete({
        where: { id: projectId }
      })
      
      // Create audit log
      await tx.projectAudit.create({
        data: {
          projectId: project.id,
          action: 'DELETE',
          name: project.name,
          description: project.description
        }
      })
    })
    
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting project:', error)
    if (error instanceof Error && error.message === 'Project not found') {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
