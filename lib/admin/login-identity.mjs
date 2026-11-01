/** Convert login identifier to a Supabase Auth email.
 * The legacy technical admin alias remains supported for backwards compatibility.
 * The X Royal customer has an additional short alias; emails remain supported.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const customerAliases = Object.freeze({
  xroyal: 'xroyalszr@gmail.com',
})

export function resolveAdminLoginEmail(input, legacyAlias, legacyEmail) {
  const identifier = String(input ?? '').trim().toLowerCase()
  if (!identifier) return { kind: 'invalid' }
  const alias = String(legacyAlias ?? '').trim().toLowerCase()
  if (alias && identifier === alias) {
    const email = String(legacyEmail ?? '').trim().toLowerCase()
    return emailPattern.test(email) ? { kind: 'ok', email } : { kind: 'config' }
  }
  if (Object.hasOwn(customerAliases, identifier))
    return { kind: 'ok', email: customerAliases[identifier] }
  return emailPattern.test(identifier)
    ? { kind: 'ok', email: identifier }
    : { kind: 'invalid' }
}
