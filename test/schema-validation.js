var test = require('tape')
var Model = require('../')


test('ensure schema has id', function(t) {
  t.throws(function() {
    new Model({
      schema: {
        title: 'Person'
      }
    })
  }, /Schema is missing id property/, 'error thrown')
  t.end()
})

test('ensure reference has id', function(t) {
  t.throws(function() {
    new Model({
      refs: [
        {
          title: 'Timestamps'
        }
      ],
      schema: {
        id: 'https://schema.ehealthafrica.org/1.0/person#',
        allOf: [
          {
            $ref: 'https://schema.ehealthafrica.org/1.0/timestamps#'
          }
        ]
      }
    })
  }, /Schema is missing id property/, 'error thrown')
  t.end()
})

test('validate schema', function(t) {
  t.throws(function() {
    new Model({
      schema: {
        id: 'https://schema.ehealthafrica.org/1.0/person#',
        allOf: [
          {
            $ref: 'https://schema.ehealthafrica.org/1.0/unknown-reference#'
          }
        ]
      }
    })
  }, /Schema validation failed/, 'error thrown')
  t.end()
})

test('validate references', function(t) {
  t.throws(function() {
    new Model({
      refs: [
        {
          id: 'https://schema.ehealthafrica.org/1.0/timestamps#',
          allOf: [
            {
              $ref: 'https://schema.ehealthafrica.org/1.0/unknown-reference#'
            }
          ]
        }
      ],
      schema: {
        id: 'https://schema.ehealthafrica.org/1.0/person#',
        allOf: [
          {
            $ref: 'https://schema.ehealthafrica.org/1.0/timestamps#'
          }
        ]
      }
    })
  }, /Schema validation failed/, 'error thrown')
  t.end()
})

test('validate valid schema', function(t) {
  t.doesNotThrow(function() {
    new Model({
      refs: [
        {
          id: 'https://schema.ehealthafrica.org/1.0/timestamps#',
          properties: {
            createdAt: {
              type: 'string'
            }
          }
        }
      ],
      schema: {
        id: 'https://schema.ehealthafrica.org/1.0/person#',
        allOf: [
          {
            $ref: 'https://schema.ehealthafrica.org/1.0/timestamps#'
          }
        ],
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    })
  }, 'no error thrown')
  t.end()
})
