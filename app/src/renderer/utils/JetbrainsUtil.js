import path from 'path'

export function getTemplateDir (studioDir = '') {
  let desDir = '/Applications/Android Studio.app/Contents/plugins/android/lib/templates/other'
  if (process.platform !== 'darwin') {
    console.log(studioDir)
    if (studioDir.trim() === '') {
      throw new Error(`Studio Directory isn't valid`)
    }
    desDir = path.join(studioDir, 'plugins/android/lib/templates/other')
  }

  return desDir
}
