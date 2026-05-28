import { auth } from '@/lib/auth'
import type { UserRole } from '@/types'

// Define what each role can do
const permissions = {
  ADMIN: [
    'manage:users',
    'manage:roles',
    'manage:blogs',
    'manage:use-cases',
    'manage:testimonials',
    'publish:content',
    'view:analytics',
    'manage:settings',
  ],
  EDITOR: [
    'manage:blogs',
    'manage:use-cases',
    'manage:testimonials',
    'publish:content',
    'view:analytics',
  ],
  AUTHOR: [
    'create:blogs',
    'edit:own-blogs',
    'create:use-cases',
    'edit:own-use-cases',
  ],
} satisfies Record<UserRole, string[]>

// Check if a role has a permission
export function hasPermission(role: UserRole, permission: string): boolean {
  return permissions[role]?.includes(permission) ?? false
}

// Server-side: get current user session and check permission
export async function requirePermission(permission: string) {
  const session = await auth()

  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }

  const role = session.user.role as UserRole
  if (!hasPermission(role, permission)) {
    throw new Error('FORBIDDEN')
  }

  return session
}

// Check if user can edit a resource (ADMIN/EDITOR can edit all, AUTHOR only their own)
export function canEdit(
  userRole: UserRole,
  userId: string,
  resourceAuthorId: string
): boolean {
  if (userRole === 'ADMIN' || userRole === 'EDITOR') return true
  return userId === resourceAuthorId
}
