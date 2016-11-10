var jsf = require('json-schema-faker')


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


module.exports = function(attributes) {
  attributes = attributes || {}

  var data = jsf(this.schema, this.refs)

  return Object.assign(data, this.defaults, attributes)
}
