module.exports = {
  fonts: {
    files: [{
      expand: true,
      src: ['node_modules/font-awesome/fonts/*'],
      dest: 'build/public/assets/fonts',
      flatten: true
    }]
  },
  images: {
    files: [{
      expand: true,
      src: [],
      dest: 'build/public/assets/images',
      flatten: true
    }]
  },
  index: {
    files: [{
      expand: true,
      src: ['src/public/app/index.html'],
      dest: 'build/public/app/',
      flatten: true
    }]
  }
};
