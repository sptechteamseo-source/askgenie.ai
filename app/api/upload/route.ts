import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { requirePermission } from '@/lib/rbac'

// POST /api/upload — upload an image file, returns { success, url }
export async function POST(request: NextRequest) {
  try {
    // Must be logged in with blog permission
    await requirePermission('manage:blogs')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'Only image files allowed (jpg, png, webp, gif)' }, { status: 400 })
    }

    // Max size 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Image must be under 5MB' }, { status: 400 })
    }

    // Read file bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Make sure public/uploads folder exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Build a unique filename: timestamp + random string + original extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    // Write to disk
    await writeFile(filepath, buffer)

    // Return the public URL
    return Response.json({ success: true, url: `/uploads/${filename}` })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }
    return Response.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
