<template>
  <div>
    <div id="choose" v-if="notMacOs">
      <input type="text" placeholder="choose you custom install location" v-model="studioDir">
      <button type="submit" @click="openDir">Choose</button>
    </div>
    <div id="deploy">
      <button class="button" type="submit" @click="deployTimber">Deploy Timber</button>
      <button class="button" type="submit" @click="deployTemplates">Deploy Template</button>
      <!--<button class="button" type="submit">Deploy Plugin</button>-->
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-new */

  import {remote} from 'electron'
  import fs from 'fs-extra'
  import path from 'path'
  import util from 'util'
  import os from 'os'
  import * as fileutil from '../utils/file-util'
  export default {
    data () {
      return {
        studioDir: '',
        assetDir: fileutil.getAssetDir(),
        notMacOs: process.platform !== 'darwin'
      }
    },

    methods: {
      openDir () {
        remote.dialog.showOpenDialog({properties: ['openDirectory']}, dir => {
          console.log(dir)
          if (!(typeof dir === 'undefined' || dir === null)) {
            this.studioDir = dir[0]
          } else {
            console.log('not choose dir')
          }
        })
      },

      deployTimber () {
        let configDir = path.join(os.homedir(), 'Library/Preferences')
        if (process.platform !== 'darwin') {
          configDir = os.homedir()
        }

        fileutil.getDirsByRe(configDir, /AndroidStudio.*/g).forEach(f => {
          let start = path.join(fileutil.getAssetDir(), 'liveTemplates/Timber.xml')
          let end = path.join(f, 'templates/Timber.xml')
          if (process.platform !== 'darwin') {
            end = path.join(f, 'config/templates/Timber.xml')
          }

          console.log(util.format('copying from %s to %s', start, end))
          try {
            fs.copySync(start, end)
            console.log(util.format('copying from %s to %s', start, end))
            new Notification('Congratulations', {body: 'Timber deploy done'})
          } catch (err) {
            console.log(err)
            remote.dialog.showErrorBox('Sorry, something went wrong :(', String(err))
          }
        })
      },

      deployTemplates () {
        let desDir = '/Applications/Android Studio.app/Contents/plugins/android/lib/templates/other'
        if (process.platform !== 'darwin') {
          console.log(this.studioDir)
          if (this.studioDir.trim() === '') {
            remote.dialog.showErrorBox(`Studio Directory isn't valid`, `Please choose a valid directory`)
            return
          }
          desDir = path.join(this.studioDir, 'plugins/android/lib/templates/other')
        }

        try {
          fileutil.getDirsByRe(path.join(fileutil.getAssetDir(), 'templates')).forEach(p => {
            let start = p
            let end = path.join(desDir, path.basename(p))
            console.log(util.format('copying from %s to %s', start, end))
            fs.copySync(start, end)
          })
          new Notification('Congratulations', {body: 'MVP pattern deploy done'})
        } catch (err) {
          console.log(err)
          remote.dialog.showErrorBox('Sorry, something went wrong :(', String(err))
        }
      }
    }

  }
</script>

<style scoped>
</style>
