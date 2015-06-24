var minimist = require('minimist')

module.exports = function(model, argv) {
  var attributes = minimist(argv)

  delete attributes._

  var model = model.generate(attributes)

  console.log(JSON.stringify(model), null, '  '))
}
