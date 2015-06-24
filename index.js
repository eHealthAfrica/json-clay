var semver = require('semver')
var ZSchema = require('z-schema')
var jsf = require('json-schema-faker')
var assert = require('assert')
var merge = require('lodash/object/merge')

var baseSchema = require('./schema.json')


ZSchema.registerFormat('semver', function(str) {
  return !!semver.valid(str)
})
jsf.formats('semver', function(gen) {
  return gen.randexp('^\\d\\.\\d\\.\\d{1,2}$')
})


jsf.extend('faker', function(faker) {
  faker.model = {
    type: function() {
      var length = faker.helpers.randomize([1,1,1,2,2,3])
      var type = []
      for (var i = 0; i < length; i++) {
        type.push(faker.helpers.slugify(faker.hacker.noun()))
      }
      return type.join('-')
    }
  }

  return faker
})



var Model = module.exports = function(options) {
  options = options || {}

  this.schema = options.schema || baseSchema
  this.refs = options.refs || []
  this.defaults = options.defaults || {}

  this.validator = new ZSchema()

  this.refs.push(baseSchema)
  if (this.schema.id !== baseSchema.id) {
    this.refs.push(this.schema)
  }

  this.refs.forEach(function(ref) {
    assert('id' in ref, 'Schema is missing id property')
  })


  // to fix `RangeError: Maximum call stack size exceeded` bug:
  // insert
  // `if (key.slice(0, 2) === '__') return`
  // above line 19 of
  // node_modules/json-schema-faker/node_modules/deref/lib/util/clone-obj.js


  this.refs.forEach(function(ref) {
    this.validator.setRemoteReference(ref.id, ref)
  }.bind(this))

  var valid = this.validator.validateSchema(this.refs)
  assert(valid, 'Schema validation failed')
}

Model.prototype.validate = function(json) {
  this.validator.validate(json, this.schema)

  return this.validator.getLastErrors()
}

Model.prototype.generate = function(attributes) {
  attributes = attributes || {}

  var data = jsf(this.schema, this.refs)

  return merge(data, this.defaults, attributes)
}
