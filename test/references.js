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
  }), undefined, 'no errors')
  t.end()
})

test('validate with errors', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3',
    createdAt: '2000-01-01T00:00:00.000Z',
    name: ''
  }), [
    {
      code: 'MIN_LENGTH',
      message: 'String is too short (0 chars), minimum 1',
      params: [ 0, 1 ],
      path: '#/name'
    }
  ], 'correct errors')
  t.end()
})

test('validate with errors in parent schema', function(t) {
  t.deepEqual(model.validate({
    type: 'person',
    version: '1.2.3'
  }), [
    {
      code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
      message: 'Missing required property: createdAt',
      params: [ 'createdAt' ],
      path: '#/'
    }
  ], 'correct errors')
  t.end()
})

test('validate with errors in base schema', function(t) {
  t.deepEqual(model.validate({
    createdAt: '2000-01-01T00:00:00.000Z',
    name: 'Audrey Horne'
  }), [
    {
      code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
      description: 'Base model defining type and version.',
      message: 'Missing required property: version',
      params: [ 'version' ],
      path: '#/'
    },
    {
      code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
      description: 'Base model defining type and version.',
      message: 'Missing required property: type',
      params: [ 'type' ],
      path: '#/'
    }
  ], 'correct errors')
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
