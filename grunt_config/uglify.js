module.exports = {
  options: {
    banner: '/*! <%= package.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    compress: {drop_console: true},
    screwIE8: true
  },
  /*
  vendor: {
    files: {
      'build/public/app/vendor.js': ['build/public/app/vendor.js']
    }
  },
  dist: {
    files: {
      'build/public/app/app.js': ['build/public/app/app.js']
    }
  }
  */
  dist: {
    files: [{
      expand: true,
      cwd: 'build/public',
      src: '**/*.js',
      dest: 'build/public'
    }]
  }
};
