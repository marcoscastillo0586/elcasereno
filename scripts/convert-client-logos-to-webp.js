const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const dir = path.join(__dirname, '..', 'public', 'images', 'clientes')

async function run() {
  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
  for (const file of files) {
    const src = path.join(dir, file)
    const out = path.join(dir, `${path.parse(file).name}.webp`)
    try {
      await sharp(src).webp({ quality: 80 }).toFile(out)
      console.log('Converted', file, '→', path.basename(out))
    } catch (err) {
      console.error('Failed', file, err.message)
    }
  }
}

run().catch(err => { console.error(err); process.exit(1) })
