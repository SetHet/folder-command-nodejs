// Codigo base midu.dev
// https://github.com/midudev/curso-node-js/blob/main/clase-1/8.ls-advanced.js

// Nuevo sistema de importacion, usar .mjs
// import path from 'node:path'
// import fs from 'node:fs/promises'
// import pc from 'picocolors'

const path = require('node:path')
const fs = require('node:fs/promises')
const pc = require('picocolors')

// console.log(process.argv)

const argv = process.argv
const folder = argv[2] ?? '.'
let args = argv[3] ?? 'a'
args = args.includes('a') ? 'fts' : args
const _date = args.includes('f')
const _type = args.includes('t')
const _size = args.includes('s')

;(async () => {
  switch (folder) {
    case '-h':
    case '--help':
      console.log(pc.blue(
        `
        Commands of folder.js

        node folder.js [<dir>] [a|f|t|s|r]

        a  all mods
        f  time
        t  type
        s  size
        r  sub-folders
        `
      ))
      break

    default:
      await search()
      break
  }
})()

// Funciones
async function search () {
  const files = await viewFolder(folder)
  if (files) {
    draw(folder, files)
  }
}

async function viewFolder (folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch (error) {
    console.error(pc.bgRed(`❌ No se encontro el directorio: ${folder}`))
    process.exit(1)
  }

  return files
}

// Draw
function draw (folder, files, prefix = '') {
  files.forEach(async (file) => {
    const direction = path.join(folder, file)
    await drawLine(direction)
  })
}

// function draw line
async function drawLine (direction) {
  const stats = await fs.stat(direction)
  // console.log(stats)

  let line = ''

  // Tipo
  if (_type) {
    const isDirectory = stats.isDirectory()
    line += pc.blue(isDirectory ? 'd ' : 'f ')
  }

  // Nombre
  line += pc.green(direction.padEnd(20))

  // Calcular tamaño
  if (_size) {
    const sizeB = stats.size
    const sizeKB = sizeB / 1024
    const sizeMB = sizeKB / 1024

    let size = `${sizeB.toFixed(2)} B`
    if (sizeKB >= 1.0) {
      size = `${sizeKB.toFixed(2)} KB`
    }
    if (sizeMB >= 1.0) {
      size = `${sizeMB.toFixed(2)} MB`
    }

    line += pc.yellow(size.padEnd(10))
  }

  // Fecha
  if (_date) {
    line += pc.cyan(stats.mtime.toLocaleString())
  }

  console.log(line)
}
