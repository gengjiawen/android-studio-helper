import fs from 'fs-extra'
import path from 'path'
import {remote} from 'electron'

export function getDirsByRe (dir, filter) {
  let dirs = []
  fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isDirectory() && file.match(filter)
  }).forEach(f => {
    f = path.join(dir, f)
    dirs.push(f)
  })
  return dirs
}

export function getFilesByRe (dir, filter) {
  let dirs = []
  fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isFile() && file.match(filter)
  }).forEach(f => {
    f = path.join(dir, f)
    dirs.push(f)
  })
  return dirs
}

export function getAssetDir () {
  const appPath = remote.app.getAppPath().replace(/node_modules.*|app.asar/, '')
  console.log(__dirname, __filename)
  return path.join(appPath, __dirname, '../assets')
}
