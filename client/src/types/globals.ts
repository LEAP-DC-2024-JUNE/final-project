export { }

// Create a type for the roles
export type Roles = 'teacher' | 'member'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}