function(doc) {
  var Clay = require('lib/json-clay')
  var model = new Clay()
  var errors = model.validate(doc)

  if (errors) {
    throw({
      forbidden: 'Validation failed.'
    })
  }
}
