import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { resolveAdminLoginEmail } from '../lib/admin/login-identity.mjs'

test('technical alias resolves to configured owner email', () => {
  assert.deepEqual(resolveAdminLoginEmail(' ADMIN ', 'admin', 'Info@Dasoft.me'), {kind:'ok',email:'info@dasoft.me'})
})
test('technical owner may sign in with real email', () => {
  assert.deepEqual(resolveAdminLoginEmail('info@dasoft.me','admin','info@dasoft.me'), {kind:'ok',email:'info@dasoft.me'})
})
test('customer email signs in independently of hard-coded owner email', () => {
  assert.deepEqual(resolveAdminLoginEmail(' Customer@Example.org ', 'admin', 'info@dasoft.me'), {kind:'ok',email:'customer@example.org'})
})
test('customer email works when optional legacy alias variables are missing', () => {
  assert.deepEqual(resolveAdminLoginEmail('person@company.me'), {kind:'ok',email:'person@company.me'})
})
test('missing legacy owner email produces config error only for the alias', () => {
  assert.deepEqual(resolveAdminLoginEmail('admin','admin'), {kind:'config'})
  assert.deepEqual(resolveAdminLoginEmail('customer@example.org','admin'), {kind:'ok',email:'customer@example.org'})
})
test('invalid identifiers are rejected before any password attempt', () => {
  for(const invalid of ['', '  ', 'some-name', '@example.org', 'person@@example.org', ' person example.org'])
    assert.equal(resolveAdminLoginEmail(invalid,'admin','info@dasoft.me').kind,'invalid')
})
