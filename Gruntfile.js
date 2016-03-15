'use strict'

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-simple-mocha')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig({
    simplemocha: {
      src: ['test/*.js'],
      options: {
        reporter: 'spec',
        growl: true
      }
    },
    watch: {
      files: ['src/*.js', 'test/*.js'],
      tasks: ['simplemocha']
    }
  })

  grunt.registerTask('test', ['simplemocha'])
  grunt.registerTask('default', ['watch'])
}
