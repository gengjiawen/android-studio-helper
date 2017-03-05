"use strict"

var fs = require("fs-extra")
var path = require("path")
var util = require("util")

var sources = []
sources.push("/Users/gengjiawen/Python/AndroidHelper/codegen_util/mvp_gen/MVPFromAndroidBoilerplate")
sources.push("/Users/gengjiawen/Python/AndroidHelper/codegen_util/mvp_gen/MVPFromAndroidBoilerplateFragment")
sources.push("/Users/gengjiawen/Python/AndroidHelper/codegen_util/mvp_gen/RecyclerViewAdapter")

sources.forEach(start => {
  let end = path.join(__dirname, "assets/templates", path.basename(start))
  console.log(util.format("copying from %s to %s", start, end))
  fs.copy(start, end, err => {
    if (err) {
      console.log(err)
    }
  })
})

