import test from 'node:test'
import assert from 'node:assert/strict'
import { escapeXml, serializeCars } from '../lib/admin/cars-xml.mjs'

test('XML escaping', () => {
  assert.equal(escapeXml('A&B <"C">\u0000'), 'A&amp;B &lt;&quot;C&quot;&gt;')
})
test('only active cars in XML', () => {
  const cars = [
    { id: 'abc', name: 'A&B', brand: 'X<Y', model: 'Turbo', year: 2026,
      category: 'luxury', price_per_day: 99, transmission: 'automatic',
      fuel_type: 'hybrid', seats: 5, available: true,
      car_images: [{image_url: 'https://example.com/img?a=1&b=2', is_main: true}] },
    { id: 'hidden', name: 'Secret', available: false }
  ]
  const xml = serializeCars(cars)
  assert.match(xml, /A&amp;B/)
  assert.match(xml, /X&lt;Y/)
  assert.match(xml, /<image main="true">https:\/\/example.com\/img\?a=1&amp;b=2<\/image>/)
  assert.doesNotMatch(xml, /Secret|hidden/)
})