
import { put } from '@vercel/blob'
import { NextRequest } from 'next/server'
import { requirePermission } from '@/lib/rbac'

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:blogs')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return Response.json(
        { success: false, error: 'Only image files allowed' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { success: false, error: 'Image must be under 5MB' },
        { status: 400 }
      )
    }

    const blob = await put(
      `${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
      }
    )

    return Response.json({
      success: true,
      url: blob.url,
    })
  } catch (error: any) {
    console.error('Upload Error:', error)

    if (error?.message === 'UNAUTHORIZED') {
      return Response.json(
        { success: false, error: 'Please log in' },
        { status: 401 }
      )
    }

    if (error?.message === 'FORBIDDEN') {
      return Response.json(
        { success: false, error: 'Not allowed' },
        { status: 403 }
      )
    }

    return Response.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}

