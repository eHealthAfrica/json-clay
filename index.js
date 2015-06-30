var semver = require('semver')
var jjv = require('jjv')
var assert = require('assert')

var generate = require('./generate')

var schemas = {
  base: require('./schema.json')
}


var formats = {
  semver: function(str) {
    return !!semver.valid(str)
  }
}


var Clay = module.exports = function(options) {
  options = options || {}

  this.schema = options.schema || schemas.base
  this.refs = options.refs || []
  this.defaults = options.defaults || {}

  this.validator = new jjv()

  this.refs.push(schemas.base)
  if (this.schema.id !== schemas.base.id) {
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

Clay.prototype.validate = function(json) {
  return this.validator.validate(this.schema, json)
}

if (typeof generate === 'function') {
  Clay.prototype.generate = generate
} else {
  Clay.prototype.generate = function() {
    throw('`clay.generate` is not included in this build of json-clay.')
  }
}

