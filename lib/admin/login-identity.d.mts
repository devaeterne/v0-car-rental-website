export type LoginIdentity =
  | { kind: 'ok'; email: string }
  | { kind: 'invalid' }
  | { kind: 'config' }
export declare function resolveAdminLoginEmail(
  input: unknown,
  legacyAlias?: string,
  legacyEmail?: string,
): LoginIdentity
