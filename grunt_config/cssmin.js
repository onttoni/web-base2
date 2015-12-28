module.exports = {
  options: {
    root: 'assets/css',
    //rebase: true
  },
  combine: {
    files: {
      'build/public/assets/css/styles.css': [
        'src/public/assets/css/styles.css',
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/font-awesome/css/font-awesome.css'
      ]
    }
  }
};
