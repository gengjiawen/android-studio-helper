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
      <div v-if="notMacOs">
        <h3>Choose your Android Studio Install Location</h3>
        <el-input type="text" placeholder="Choose you Android Studio install location" v-model="studioDir" >
          <template slot="append">
            <el-button type="submit" @click="openDir">Choose</el-button>
          </template>
        </el-input>
      </div>

      <div>
        <div>
          <b>Input your template</b>
          <el-button type="text" @click="openTemplate">Click me to Learn more about Template</el-button>
        </div>
        <el-autocomplete
                class="inline-input"
                placeholder="Please input your template, like riggaroo/android-studio-group-templates-mvp"
                :fetch-suggestions="querySearch"
                v-model="todo">
          <template slot="append">
            <el-button type="submit" @click="deployTemplate">Deploy</el-button>
          </template>
        </el-autocomplete>
      </div>

      <!--<div>-->
        <!--<el-button class="button" type="submit" @click="deployTemplates">Deploy Inner Template</el-button>-->
      <!--</div>-->
    </div>

    <!--<button class="button" type="submit">Deploy Plugin</button>-->

  </div>
</template>

<script>
/* eslint-disable no-new */
import {remote, shell} from 'electron'
import fs from 'fs-extra'
import path from 'path'
import util from 'util'
import os from 'os'
import * as FileUtil from '../utils/FileUtil'
import {getTemplateDir} from '../utils/JetbrainsUtil'
import download from 'download-git-repo'
import RepoDB from '../data/RepoDB'
import { STUDIO_DIR } from '../utils/Constants'
export default {
  data () {
    return {
      studioDir: '',
      assetDir: FileUtil.getAssetDir(),
      timberLink: 'https://github.com/JakeWharton/timber/issues/173',
      todo: '',
      db: RepoDB,
      notMacOs: process.platform !== 'darwin'
    }
  },
  created () {
    this.studioDir = localStorage.getItem(STUDIO_DIR)
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
    querySearch (queryString, cb) {
      this.db.repos
        .toArray()
        .then(links => {
          const results = queryString ? links.filter(a => {
            console.log(a)
            return a.value.startsWith(queryString)
          }) : links
          // call callback function to return suggestions
          cb(results)
        })
    },
    openTimber () {
      shell.openExternal(this.timberLink)
    },

    openTemplate () {
      shell.openExternal('https://riggaroo.co.za/custom-file-template-group-android-studiointellij/')
    },

    deployTimber () {
      let configDir = path.join(os.homedir(), 'Library/Preferences')
      if (process.platform !== 'darwin') {
        configDir = os.homedir()
      }

      FileUtil.getDirsByRe(configDir, /AndroidStudio.*/g).forEach(f => {
        let timber = path.join(FileUtil.getAssetDir(), 'liveTemplates')
        let end = path.join(f, 'templates')
        if (process.platform !== 'darwin') {
          end = path.join(f, 'config/templates')
        }

        console.log(util.format('copying from %s to %s', timber, end))
        try {
          fs.copySync(timber, end)
          console.log(util.format('copying from %s to %s', timber, end))
          new Notification('Congratulations', {body: 'Timber deploy done'})
        } catch (err) {
          console.log(err)
          remote.dialog.showErrorBox('Sorry, something went wrong :(', String(err))
        }
      })
    },
    deployTemplate () {
      let desDir = getTemplateDir(this.studioDir)
      let repo = this.todo
      console.log(desDir)
      localStorage.setItem(STUDIO_DIR, this.studioDir)
      download(repo, desDir, err => {
        if (err) {
          remote.dialog.showErrorBox('Sorry, something went wrong :(', String(err))
        } else {
          this.db.repos
            .put(({value: repo, lastUsed: new Date().getTime()}))
            .catch(err => {
              console.log(err)
            })
          new Notification('Congratulations', {body: 'Deploy template done'})
        }
      })
    },
    deployTemplates () {
      let desDir = getTemplateDir(this.studioDir)

      try {
        FileUtil.getDirsByRe(path.join(FileUtil.getAssetDir(), 'templates')).forEach(p => {
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

      FileUtil.getDirsByRe(pluginDir, /WebStorm.*/g).forEach(f => {
        let start = path.join(FileUtil.getAssetDir(), 'plugins/DatabaseTools')
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

.inline-input
  width 100%

</style>
