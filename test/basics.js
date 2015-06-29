var test = require('tape')
var Model = require('../')

var model = new Model()

test('validate', function(t) {
  t.equal(model.validate({
    type: 'my-model',
    version: '1.2.3'
  }), null, 'no errors')
  t.end()
})

test('validate with errors', function(t) {
  t.deepEqual(model.validate({
  }), {
    validation: {
      type: {
        required: true
      },
      version: {
        required: true
      }
    }
  }, 'correct errors')
  t.end()
})

test('generate', function(t) {
  var doc = model.generate()
  t.ok('type' in doc, 'type generated')
  t.ok('version' in doc, 'version generated')
  t.end()
})

test('generate with predefined attributes', function(t) {
  var doc = model.generate({ type: 'my-type' })
  t.equal(doc.type, 'my-type', 'type used')
  t.end()
})
