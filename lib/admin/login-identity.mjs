/** Convert login identifier to a Supabase Auth email.
 * The legacy technical admin alias remains supported for backwards compatibility.
 * All other administrators log in directly with their own email address.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function resolveAdminLoginEmail(input, legacyAlias, legacyEmail) {
  const identifier = String(input ?? '').trim().toLowerCase()
  if (!identifier) return { kind: 'invalid' }
  const alias = String(legacyAlias ?? '').trim().toLowerCase()
  if (alias && identifier === alias) {
    const email = String(legacyEmail ?? '').trim().toLowerCase()
    return emailPattern.test(email) ? { kind: 'ok', email } : { kind: 'config' }
  }
  return emailPattern.test(identifier)
    ? { kind: 'ok', email: identifier }
    : { kind: 'invalid' }
}
