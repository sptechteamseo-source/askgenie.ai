/**
 * POST /api/upload
 * ─────────────────
 * Accepts a multipart FormData body with a single "file" field.
 * Validates format (jpg/png/webp) and size (≤ 5 MB), uploads to
 * Cloudinary, and returns the secure URL.
 *
 * The returned URL is stored by the calling component in MongoDB via
 * the relevant resource API (blogs, use-cases, users/profile).
 *
 * Authentication: any logged-in user (authors need it for their content).
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
  uploadImageToCloudinary,
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
} from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // ── Auth guard ────────────────────────────────────────────────────────────
    const session = await auth()
    if (!session?.user) {
      return Response.json(
        { success: false, error: 'Please log in to upload images' },
        { status: 401 }
      )
    }

    // ── Parse form data ───────────────────────────────────────────────────────
    const formData = await request.formData()
    const file     = formData.get('file') as File | null

    if (!file) {
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // ── MIME-type validation (jpg, png, webp only) ────────────────────────────
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Only JPG, PNG and WebP images are allowed' },
        { status: 400 }
      )
    }

    // ── File-size validation (≤ 5 MB) ─────────────────────────────────────────
    if (file.size > MAX_FILE_BYTES) {
      return Response.json(
        { success: false, error: 'Image must be under 5 MB' },
        { status: 400 }
      )
    }

    // ── Convert File → Buffer ─────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    // ── Upload to Cloudinary ──────────────────────────────────────────────────
    const result = await uploadImageToCloudinary(buffer, 'atg-marketing')

    // ── Return the secure Cloudinary URL ─────────────────────────────────────
    return Response.json({
      success:  true,
      url:      result.url,          // https://res.cloudinary.com/…
      publicId: result.publicId,
      width:    result.width,
      height:   result.height,
      format:   result.format,
      bytes:    result.bytes,
    })

  } catch (error: any) {
    console.error('[POST /api/upload]', error)
    return Response.json(
      { success: false, error: 'Upload failed — please try again' },
      { status: 500 }
    )
  }
}
