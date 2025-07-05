import { prisma } from '../../../utils/prisma'
import { AppError, catchAsync } from '../../../utils/errorHandler'

export const config = {
  regions: ['fra1'] // EU region for serverless execution
}

// GET endpoint to retrieve audit logs
export const GET = catchAsync(async (req: Request) => {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('projectId')
  const limit = url.searchParams.get('limit') || '50' // Default to 50 records
  const page = url.searchParams.get('page') || '1' // Default to first page
  
  const pageSize = parseInt(limit)
  const pageNumber = parseInt(page)
  const skip = (pageNumber - 1) * pageSize
  
  // Filter by projectId if provided
  const where = projectId ? { projectId: parseInt(projectId) } : {}
  
  // Get audit logs with pagination
  const auditLogs = await prisma.projectAudit.findMany({
    where,
    orderBy: {
      performedAt: 'desc' // Most recent first
    },
    take: pageSize,
    skip
  })
  
  // Get total count for pagination
  const total = await prisma.projectAudit.count({ where })
  
  return Response.json({
    data: auditLogs,
    pagination: {
      total,
      page: pageNumber,
      pageSize,
      pages: Math.ceil(total / pageSize)
    }
  })
})

// POST endpoint to manually create an audit log (useful for special cases)
export const POST = catchAsync(async (req: Request) => {
  const data = await req.json()
  
  // Validate required fields
  if (!data.projectId || !data.action || !data.name) {
    throw new AppError('Missing required fields: projectId, action, and name are required', 400)
  }
  
  // Create the audit entry
  const auditLog = await prisma.projectAudit.create({
    data: {
      projectId: parseInt(data.projectId),
      action: data.action,
      name: data.name,
      description: data.description
    }
  })
  
  return Response.json(auditLog, { status: 201 })
})
