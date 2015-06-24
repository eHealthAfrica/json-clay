var test = require('tape')
var Model = require('../')

var model = new Model({
  defaults: {
    name: 'Audrey Horne'
  }
})


test('generate', function(t) {
  var doc = model.generate()
  t.equal(doc.name, 'Audrey Horne', 'default name set')
  t.end()
})

test('generate with given attribute', function(t) {
  var doc = model.generate({ name: 'Ben Horne' })
  t.equal(doc.name, 'Ben Horne', 'given name used')
  t.end()
})
