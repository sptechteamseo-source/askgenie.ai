/**
 * lib/cloudinary.ts
 * ------------------
 * Server-only Cloudinary utility.  Import ONLY inside API routes or
 * other server-side code — never in a 'use client' component.
 *
 * Cloudinary SDK automatically reads CLOUDINARY_URL when present, so the
 * explicit config call below acts as a belt-and-braces fallback that also
 * works when only the individual env vars are set (e.g. in CI/CD pipelines
 * that inject them separately).
 */

// This import throws a build-time error if this module is accidentally
// imported inside a Client Component ('use client').  The cloudinary SDK
// uses Node.js built-ins (crypto, https, stream) that are unavailable
// in the browser — this guard surfaces the mistake early.
import 'server-only'

import { v2 as cloudinary } from 'cloudinary'

// ─── SDK configuration ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,   // always return https:// URLs
})

// ─── Constants ───────────────────────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
export const MAX_FILE_BYTES      = 5 * 1024 * 1024   // 5 MB

// ─── Result shape returned by uploadImageToCloudinary ────────────────────────
export interface CloudinaryUploadResult {
  /** HTTPS URL — always secure regardless of the `secure` SDK flag */
  url:      string
  publicId: string
  width:    number
  height:   number
  format:   string
  bytes:    number
}

// ─── Core upload helper ───────────────────────────────────────────────────────
/**
 * Upload a Buffer to Cloudinary and return the result.
 *
 * @param buffer   Raw image bytes
 * @param folder   Cloudinary folder (default: "atg-marketing")
 * @param filename Optional public_id prefix (Cloudinary appends a unique suffix)
 */
export async function uploadImageToCloudinary(
  buffer:   Buffer,
  folder    = 'atg-marketing',
  filename?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type:    'image' as const,
      allowed_formats:  ALLOWED_EXTENSIONS,
      overwrite:        false,
      unique_filename:  true,
      use_filename:     !!filename,
      ...(filename ? { public_id: `${folder}/${filename}` } : {}),
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error('Cloudinary upload failed — no result returned'))
        return
      }
      resolve({
        url:      result.secure_url,
        publicId: result.public_id,
        width:    result.width,
        height:   result.height,
        format:   result.format,
        bytes:    result.bytes,
      })
    })

    stream.end(buffer)
  })
}

// ─── Delete helper (optional — useful for cleanup on content deletion) ────────
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

export { cloudinary }
