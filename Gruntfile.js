module.exports = function(grunt) {

  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt_config'),
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    },
  });

  grunt.registerTask('default', ['debug']);
  grunt.registerTask('common', ['clean', 'copy', 'cssmin']);
  grunt.registerTask('debug', ['common', 'webpack:debug']);
  grunt.registerTask('dist', ['common', 'webpack:debug', 'uglify:dist']);

};

