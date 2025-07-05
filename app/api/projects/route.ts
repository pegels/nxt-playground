import { prisma } from '../../../utils/prisma'
import { AppError, catchAsync } from '../../../utils/errorHandler'

export const config = {
  regions: ['fra1'] // EU region for serverless execution
}

export const GET = catchAsync(async (req: Request) => {
  const url = new URL(req.url)
  const includeDeleted = url.searchParams.get('includeDeleted') === 'true'
  
  const projects = await prisma.project.findMany({
    where: includeDeleted ? {} : {
      isDeleted: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return Response.json(projects)
})

export const POST = catchAsync(async (req: Request) => {
  const data = await req.json()
  
  if (!data.name) {
    throw new AppError('Project name is required', 400)
  }
  
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
  
  return Response.json(result, { status: 201 })
})

export const PUT = catchAsync(async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const restore = url.searchParams.get('restore') === 'true'
  
  if (!id) {
    throw new AppError('Project ID is required', 400)
  }
  
  const projectId = parseInt(id)
  
  // Handle project restoration if restore=true
  if (restore) {
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Get the project before restoration for audit purposes
      const project = await tx.project.findUnique({
        where: { id: projectId }
      })
      
      if (!project) {
        throw new AppError('Project not found', 404)
      }
      
      // Restore the project
      const restoredProject = await tx.project.update({
        where: { id: projectId },
        data: { isDeleted: false }
      })
      
      // Create audit log
      await tx.projectAudit.create({
        data: {
          projectId: restoredProject.id,
          action: 'RESTORE',
          name: restoredProject.name,
          description: restoredProject.description
        }
      })
      
      return restoredProject
    })
    
    return Response.json(result)
  }
  
  // Regular update (not restoration)
  const data = await req.json()
  
  if (!data.name) {
    throw new AppError('Project name is required', 400)
  }
  
  // Use a transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (tx) => {
    // Get the project before update for audit purposes
    const oldProject = await tx.project.findUnique({
      where: { id: projectId }
    })
    
    if (!oldProject) {
      throw new AppError('Project not found', 404)
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
})

export const DELETE = catchAsync(async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    throw new AppError('Project ID is required', 400)
  }
  
  const projectId = parseInt(id)
  
  // Use a transaction to ensure both operations succeed or fail together
  await prisma.$transaction(async (tx) => {
    // Get the project before soft deletion for audit purposes
    const project = await tx.project.findUnique({
      where: { id: projectId }
    })
    
    if (!project) {
      throw new AppError('Project not found', 404)
    }
    
    // Soft delete the project by marking it as deleted
    await tx.project.update({
      where: { id: projectId },
      data: { isDeleted: true }
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
})
