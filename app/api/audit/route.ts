import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const config = {
  regions: ['fra1'] // EU region for serverless execution
}

// GET endpoint to retrieve audit logs
export async function GET(req: Request) {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('projectId')
  const limit = url.searchParams.get('limit') || '50' // Default to 50 records
  const page = url.searchParams.get('page') || '1' // Default to first page
  
  const pageSize = parseInt(limit)
  const pageNumber = parseInt(page)
  const skip = (pageNumber - 1) * pageSize
  
  try {
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
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch audit logs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// POST endpoint to manually create an audit log (useful for special cases)
export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.projectId || !data.action || !data.name) {
      return new Response(JSON.stringify({ error: 'Missing required fields: projectId, action, and name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
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
  } catch (error) {
    console.error('Error creating audit log:', error)
    return new Response(JSON.stringify({ error: 'Failed to create audit log' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
