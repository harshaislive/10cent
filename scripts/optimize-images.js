#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// This script helps optimize images for better performance
// Requires imagemin to be installed: npm install -g imagemin-cli

const imageDirs = [
  'public/desktop',
  'public/mobile',
  'public'
]

const qualitySettings = {
  desktop: { quality: 85, maxWidth: 1920 },
  mobile: { quality: 75, maxWidth: 1080 },
  general: { quality: 80, maxWidth: 1200 }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileStats(filePath) {
  const stats = fs.statSync(filePath)
  return {
    size: stats.size,
    formattedSize: formatFileSize(stats.size)
  }
}

function optimizeImage(inputPath, outputPath, settings) {
  try {
    // Create backup
    const backupPath = inputPath + '.backup'
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath)
    }

    const originalStats = getFileStats(inputPath)

    console.log(`Optimizing: ${path.basename(inputPath)}`)
    console.log(`  Original size: ${originalStats.formattedSize}`)

    // Use imagemin to optimize the image
    const command = `npx imagemin ${inputPath} --out.dir=${path.dirname(outputPath)} --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant --plugin=imagemin-svgo`

    try {
      execSync(command, { stdio: 'pipe' })

      // If optimization succeeded, rename the optimized file
      const optimizedPath = path.join(
        path.dirname(outputPath),
        path.basename(inputPath)
      )

      if (fs.existsSync(optimizedPath) && optimizedPath !== inputPath) {
        fs.copyFileSync(optimizedPath, inputPath)
        fs.unlinkSync(optimizedPath)
      }

    } catch (error) {
      console.log(`  Warning: Could not optimize with imagemin. Original file kept.`)
    }

    const optimizedStats = getFileStats(inputPath)
    const savings = originalStats.size - optimizedStats.size
    const savingsPercent = ((savings / originalStats.size) * 100).toFixed(1)

    console.log(`  Optimized size: ${optimizedStats.formattedSize}`)
    console.log(`  Savings: ${formatFileSize(savings)} (${savingsPercent}%)`)
    console.log('')

    return {
      original: originalStats.size,
      optimized: optimizedStats.size,
      savings: savings,
      savingsPercent: parseFloat(savingsPercent)
    }

  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message)
    return null
  }
}

function optimizeDirectory(dirPath, settings) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Skipping...`)
    return
  }

  const files = fs.readdirSync(dirPath)
  const imageFiles = files.filter(file =>
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
  )

  console.log(`\n=== Optimizing ${path.basename(dirPath)} images ===\n`)

  let totalOriginal = 0
  let totalOptimized = 0
  let filesProcessed = 0

  imageFiles.forEach(file => {
    const filePath = path.join(dirPath, file)
    const result = optimizeImage(filePath, filePath, settings)

    if (result) {
      totalOriginal += result.original
      totalOptimized += result.optimized
      filesProcessed++
    }
  })

  if (filesProcessed > 0) {
    const totalSavings = totalOriginal - totalOptimized
    const totalSavingsPercent = ((totalSavings / totalOriginal) * 100).toFixed(1)

    console.log(`=== Summary for ${path.basename(dirPath)} ===`)
    console.log(`Files processed: ${filesProcessed}`)
    console.log(`Total original size: ${formatFileSize(totalOriginal)}`)
    console.log(`Total optimized size: ${formatFileSize(totalOptimized)}`)
    console.log(`Total savings: ${formatFileSize(totalSavings)} (${totalSavingsPercent}%)`)
  } else {
    console.log(`No image files found in ${dirPath}`)
  }
}

function main() {
  console.log('🖼️  Image Optimization Script')
  console.log('==============================\n')

  // Check if imagemin is available
  try {
    execSync('npx imagemin --version', { stdio: 'pipe' })
  } catch (error) {
    console.log('⚠️  imagemin not found. Installing...')
    try {
      execSync('npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo', { stdio: 'inherit' })
      console.log('✅ imagemin installed successfully\n')
    } catch (installError) {
      console.error('❌ Failed to install imagemin. Please run: npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo')
      process.exit(1)
    }
  }

  let totalOriginal = 0
  let totalOptimized = 0

  imageDirs.forEach(dir => {
    const settings = dir.includes('desktop') ? qualitySettings.desktop :
                     dir.includes('mobile') ? qualitySettings.mobile :
                     qualitySettings.general

    optimizeDirectory(dir, settings)
  })

  console.log('\n🎉 Optimization complete!')
  console.log('\n💡 Tips for even better performance:')
  console.log('   - Consider using WebP format for better compression')
  console.log('   - Use responsive images with srcset')
  console.log('   - Implement lazy loading for below-the-fold images')
  console.log('   - Consider using a CDN for image delivery')
}

if (require.main === module) {
  main()
}