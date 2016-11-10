var minimist = require('minimist')

module.exports = function(model, argv) {
  var opts = {}
  var attributes = minimist(argv)

  if (attributes._.indexOf('--all') !== -1) {
    opts.all = true
  }

  delete attributes._

  var model = model.generate(attributes, opts)

  console.log(JSON.stringify(model, null, '  '))
}
