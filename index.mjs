import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import { createInterface } from 'readline'
import { unlink } from 'fs/promises'

const readline = createInterface({ input: process.stdin, output: process.stdout })

function getFolderPath (imagePath) {
  const slitImagePath = imagePath.split('/')
  return imagePath.slice(0, imagePath.length - (slitImagePath[slitImagePath.length - 1].length + 1))
}


async function convertToWebP(imagePath, quality = 80) {
  try {
    await imagemin([imagePath], {
      destination: getFolderPath(imagePath),
      plugins: [
        imageminWebp({ quality: quality })
      ]
    })

    await unlink(imagePath)
    console.log('Original image deleted!')

    console.log('Conversion to WebP completed!')
  } catch (error) {
    console.error('Error converting image to WebP:', error)
  }
}

function promptUser() {
  readline.question('Image path: ', async (imagePath) => {
    const qualityInput = await new Promise((resolve) => {
      readline.question('Quality (default 80): ', (answer) => {
        resolve(answer.trim())
      })
    })
    const quality = qualityInput ? parseInt(qualityInput) : 80
    await convertToWebP(imagePath.slice(1, -1), quality)
    readline.close()
  })
}

promptUser()
