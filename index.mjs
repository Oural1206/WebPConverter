import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import { createInterface } from 'readline'
import { unlink } from 'fs'

const readline = createInterface({ input: process.stdin, output: process.stdout })

function getFolderPath (imagePath) {
  const slitImagePath = imagePath.split('/')
  return imagePath.slice(0, imagePath.length - (slitImagePath[slitImagePath.length - 1].length + 1))
}

function start () {
  readline.question('Image path : ',  imagePath => {
    if (imagePath[imagePath.length - 1] === ' ') {
      imagePath = imagePath.slice(0, imagePath.length - 1)
    }
    const folderPath = getFolderPath(imagePath)
    readline.question('Quality (default 50) : ', async quality => {
      if (quality === '') {
        quality = 50
      } else {
        quality = Number(quality)
      }
      await imagemin([imagePath], {
        destination: folderPath,
        plugins: [
          imageminWebp({ quality: quality })
        ]
      })
      unlink(imagePath, () => {
        console.log('Image converted !')
        start()
      })
    })
  })
}

start()
