var jsf = require('json-schema-faker')
var merge = require('lodash/object/merge')


jsf.formats('semver', function(gen) {
  return gen.randexp('^\\d\\.\\d\\.\\d{1,2}$')
})
jsf.extend('faker', function(faker) {
  faker.clay = {
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

function getAllProperties(schema) {
  if (!schema.properties) {
    return
  }
  var required = Object.keys(schema.properties || {})
  if (!required.length) {
    return
  }
  return {
    required
  }
}

module.exports = function(attributes, opts) {
  attributes = attributes || {}
  var schema = this.schema

  if (opts && opts.all) {
    // Until https://github.com/json-schema-faker/json-schema-faker/issues/81
    schema = Object.assign({}, schema, getAllProperties(schema))
  }

  var data = jsf(schema, this.refs)

  return merge(data, this.defaults, attributes)
}
