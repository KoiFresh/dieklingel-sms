const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/ums',
    outputDir : 'lib/services/ums/@vue',
    pages : {
        index : {
            entry: 'src/services/ums/@vue/main.js',
            filename: 'index.html',
            template : 'src/services/ums/@vue/main.html'
        }
    }
})