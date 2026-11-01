const invalid = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g
export function escapeXml(value) {
  return String(value ?? '').replace(invalid, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
function element(name, value) { return '<' + name + '>' + escapeXml(value) + '</' + name + '>' }
export function serializeCars(cars, siteUrl = 'https://xroyalrentacar.me') {
  const base = new URL(siteUrl)
  const xml = cars.filter(car => car.available === true).map(car => {
    const fields = ['id','brand','model','name','year','category','price_per_day','transmission','fuel_type','seats']
    const children = fields.map(key => '    ' + element(key, car[key])).join('\n')
    const images = (car.car_images || []).filter(i => typeof i.image_url === 'string')
      .map(i => '      <image main="' + (i.is_main === true) + '">' + escapeXml(i.image_url) + '</image>').join('\n')
    const detail = new URL('/cars/' + encodeURIComponent(car.id), base).href
    return '  <car>\n' + children + '\n    ' + element('currency', 'EUR')
      + '\n    ' + element('url', detail) + '\n    <images>\n' + images
      + (images ? '\n' : '') + '    </images>\n  </car>'
  })
  return '<?xml version="1.0" encoding="UTF-8"?>\n<cars currency="EUR">\n'
    + xml.join('\n') + (xml.length ? '\n' : '') + '</cars>\n'
}