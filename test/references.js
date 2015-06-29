var test = require('tape')
var Model = require('../')

var schemas = {
  timestamps: {
    id: 'https://schema.ehealthafrica.org/1.0/timestamps#',
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: ['createdAt']
  },

  person: {
    id: 'https://schema.ehealthafrica.org/1.0/person#',
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      {
        $ref: 'https://schema.ehealthafrica.org/1.0/base#'
      },
      {
        $ref: 'https://schema.ehealthafrica.org/1.0/timestamps#'
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
}

var model = new Model({
  refs: [
    schemas.timestamps
  ],
  schema: schemas.person
})


test('validate', function(t) {
  t.equal(model.validate({
    type: 'person',
    version: '1.2.3',
    createdAt: '2000-01-01T00:00:00.000Z',
    name: 'Audrey Horne'
  }), null, 'no errors')
  t.end()
})

test('validate with errors', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3',
    createdAt: '2000-01-01T00:00:00.000Z',
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

test('validate with errors in parent schema', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3'
  }), {
    validation: {
      createdAt: {
        required: true
      }
    }
  }, 'correct errors')
  t.end()
})

test('validate with errors in base schema', function(t) {
  t.deepEqual(model.validate({
    createdAt: '2000-01-01T00:00:00.000Z',
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


// required properties not generated
test.skip('generate required properties', function(t) {
  var doc = model.generate()
  t.ok('name' in doc, 'name generated')
  t.end()
})

test('generate required parent properties', function(t) {
  var doc = model.generate()
  t.ok('createdAt' in doc, 'createdAt generated')
  t.end()
})

// required base properties not generated
test.skip('generate required base properties', function(t) {
  var doc = model.generate()
  t.ok('type' in doc, 'type generated')
  t.ok('version' in doc, 'version generated')
  t.end()
})

test('generate with predefined attributes', function(t) {
  var doc = model.generate({ createdAt: '2000-01-01T00:00:00.000Z' })
  t.equal(doc.createdAt, '2000-01-01T00:00:00.000Z', 'createdAt used')
  t.end()
})
