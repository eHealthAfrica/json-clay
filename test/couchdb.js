var test = require('tape')
var nano = require('nano')
var push = require('couchdb-push')
var path = require('path')

var url = process.env.COUCH || 'http://localhost:5984'
var dbname = 'test-json-clay'
var couch = nano(url)
var db = couch.use(dbname)
var source = path.join(__dirname, 'fixtures')

function setup(callback) {
  couch.db.destroy(dbname, function() {
    push(db, source, callback)
  })
}

test('rejected insert', function(t) {
  setup(function() {
    db.insert({}, function(error) {
      t.equal(error.statusCode, 403, 'correct status code returned')
      t.equal(error.reason, 'Validation failed.', 'correct reason returned')
      t.end()
    })
  })
})

test('accepted insert', function(t) {
  setup(function() {
    db.insert({ type: 'foo', version: '1.2.3' }, function(error, response) {
      t.equal(error, null, 'no error')
      t.ok(response.ok, 'response is ok')
      t.end()
    })
  })
})
