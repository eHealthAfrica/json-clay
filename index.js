var semver = require('semver')
var jjv = require('jjv')
var assert = require('assert')

var generate = require('./generate')

var baseSchema = require('./schema.json')


var formats = {
  semver: function(str) {
    return !!semver.valid(str)
  }
}


var Model = module.exports = function(options) {
  options = options || {}

  this.schema = options.schema || baseSchema
  this.refs = options.refs || []
  this.defaults = options.defaults || {}

  this.validator = new jjv()

  this.refs.push(baseSchema)
  if (this.schema.id !== baseSchema.id) {
    this.refs.push(this.schema)
  }

  this.refs.forEach(function(ref) {
    assert('id' in ref, 'Schema is missing id property')
  })

  this.refs.forEach(function(ref) {
    this.validator.addSchema(ref.id, ref)
  }.bind(this))

  for (var format in formats) {
    this.validator.addFormat(format, formats[format])
  }
}

Model.prototype.validate = function(json) {
  return this.validator.validate(this.schema, json)
}

if (typeof generate === 'function') {
  Model.prototype.generate = generate
}

