function(doc) {
  var Model = require('lib/eha-model')
  var model = new Model()

  var errors = model.validate(doc)

  if (errors) {
    throw({
      forbidden: 'Validation failed.'
    })
  }
}
