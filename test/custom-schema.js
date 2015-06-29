var test = require('tape')
var Model = require('../')

var model = new Model({
  schema: {
    id: 'https://schema.ehealthafrica.org/1.0/person#',
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      {
        $ref: 'https://schema.ehealthafrica.org/1.0/base#'
      }
    ],
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['name']
  }
})


test('validate', function(t) {
  t.equal(model.validate({
    type: 'person',
    version: '1.2.3',
    name: 'Audrey Horne'
  }), null, 'no errors')
  t.end()
})

test('validate missing name', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3'
  }), {
    validation: {
      name: {
        required: true
      }
    }
  }, 'correct errors')
  t.end()
})

test('validate invalid name', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3',
    name: ''
  }), {
    validation: {
      name: {
        minLength: true
      }
    }
  }, 'correct errors')
  t.end()
})

test('validate with errors in base schema', function(t) {
  t.deepEqual(model.validate({
    name: 'Audrey Horne'
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
  var doc = model.generate({ name: 'Audrey Horne' })
  t.equal(doc.name, 'Audrey Horne', 'name used')
  t.end()
})
