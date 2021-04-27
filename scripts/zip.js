const zipper = require('zip-local')

zipper.sync
  .zip('./dist/')
  .compress()
  .save('dist.zip')
