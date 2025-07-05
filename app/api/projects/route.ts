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
  const project = await prisma.project.create({ data })
  return Response.json(project)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return new Response('Project ID is required', { status: 400 })
  }
  
  try {
    await prisma.project.delete({
      where: { id: parseInt(id) }
    })
    return new Response(null, { status: 204 })
  } catch (error) {
    return new Response('Failed to delete project', { status: 500 })
  }
}
