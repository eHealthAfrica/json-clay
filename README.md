# eha-model
eHealth Africa’s base model.


## Usage
```js
var Model = require('eha-model')

var person = new Model({
  schema: {
    id: 'https://schema.ehealthafrica.org/1.0/person#',
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      {
        $ref: 'https://schema.ehealthafrica.org/1.0/base#'
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
  },
  defaults: {
    type: 'person',
    version: '1.2.3'
  }
}) 

person.validate({
  type: 'person',
  version: '1.2.3'
})
// [
//   {
//     code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
//     message: 'Missing required property: name',
//     params: [ 'name' ],
//     path: '#/'
//   }
// ]

person.generate({
  version: '1.0.0',
})
// {
//   "type": "person",
//   "version": "1.0.0"
// }

// The future:
// person.migrate({
//   version: '1.0.0'
//   firstName: 'Audrey',
//   lastName: 'Horne'
// })
// // [
// //   {
// //     version: '1.2.3'
// //     name: 'Audrey Horne'
// //   }
// // ]
```


## Constructor: `new Model([options])`
Create a model.

* `options.schema` - JSON schema of the model. Default is the [base schema](schema.json).
* `options.refs` - Array of referenced schemas.
* `options.defaults` - Default properties used for generating fake data.


## Validation: `model.validate(json)`
Validate the `attribjson` against the schema.
Returns `undefined` if the data is valid, otherwise an array of errors.


## Validation Errors
A typical error array looks like this:

```js
[
  {
    code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
    description: 'Base model defining type and version.',
    message: 'Missing required property: version',
    params: [ 'version' ],
    path: '#/'
  },
  {
    code: 'MIN_LENGTH',
    message: 'String is too short (0 chars), minimum 1',
    params: [ 0, 1 ],
    path: '#/name'
  }
]
```


## Generate Fake Data: `model.generate([attributes])`
Use this method if you want to get fake data. Utilizes
[json-schema-faker](https://github.com/pateketrueke/json-schema-faker).
If an `attributes` object is provided, its properties will be used instead of
faked values.


## `Model.schema`
Holds the `schema`.


## `Model.refs`
Holds the `refs`.


## `Model.defaults`
Holds the `defaults`.


## CLI
Use it to create a simple command line utility which generates fake data:

```js
var Model = require('eha-model')
var cli = require('eha-model/cli')

var person = new Model()

cli(person, process.argv.slice(2))
```


## Tests
```sh
npm test
```


## Author
© 2015 [eHealth Systems Africa](http://ehealthafrica.org)
