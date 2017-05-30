<template>
  <div>
    <div class="util">
      <h2>Util</h2>
      <div>
        <el-button class="button" type="submit" @click="deployTimber">Deploy Timber</el-button>
        <el-button type="text" @href="timberLink" @click="openTimber">Learn more</el-button>
      </div>
    </div>

    <div class="templates">
      <h2>Templates</h2>
      <el-input type="text" placeholder="Choose you Android Studio install location" v-model="studioDir" v-if="notMacOs">
            <template slot="append">
              <el-button type="submit" @click="openDir">Choose</el-button>
            </template>
      </el-input>
      <el-button class="button" type="submit" @click="deployTemplates">Deploy Template</el-button>
    </div>

    <div class="deploy">
      <!--<button class="button" type="submit">Deploy Plugin</button>-->
    </div>

  </div>
</template>

<script>
  /* eslint-disable no-new */

  import {remote, shell} from 'electron'
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
        timberLink: 'https://github.com/JakeWharton/timber/issues/173',
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
  
      openTimber () {
        shell.openExternal(this.timberLink)
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
      },
      deployDBTools () {
        let pluginDir = path.join(os.homedir(), 'Library/Application Support')
        if (process.platform !== 'darwin') {
          pluginDir = os.homedir()
        }

        fileutil.getDirsByRe(pluginDir, /WebStorm.*/g).forEach(f => {
          let start = path.join(fileutil.getAssetDir(), 'plugins/DatabaseTools')
          let end = path.join(f, 'DatabaseTools')
          if (process.platform !== 'darwin') {
            end = path.join(f, 'config/plugins', 'DatabaseTools')
          }

          console.log(util.format('copying from %s to %s', start, end))
          try {
            fs.copySync(start, end)
            console.log(util.format('copying from %s to %s', start, end))
            new Notification('Congratulations', {body: 'Plugin has been deploy, please restart your IDE'})
          } catch (err) {
            console.log(err)
            remote.dialog.showErrorBox('Sorry, something went wrong :(', String(err))
          }
        })
      }
    }

  }
</script>

<style lang="stylus" scoped>

.util, .templates
  display flex
  flex-direction column
  margin 20px

.templates
  justify-content space-around
  .el-input
    margin-top 10px
    margin-bottom  10px

</style>
