# JSON Clay
JSON schema validation, fake data generation and migrations.

[![Build
Status](https://travis-ci.org/eHealthAfrica/json-clay.svg)](https://travis-ci.org/eHealthAfrica/json-clay)


## Usage
```js
var Clay = require('json-clay')

var person = new Clay({
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
      },
      age: {
        type: 'number'
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
// =>
// {
//   validation: {
//     name: {
//       required: true
//     }
//   }
// }


person.generate({
  version: '1.0.0',
})
// =>
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
// // =>
// // [
// //   {
// //     version: '1.2.3'
// //     name: 'Audrey Horne'
// //   }
// // ]
```


## Constructor: `new Clay([options])`
Create a new JSON schema clay.

* `options.schema` - JSON schema of the clay. Default is the [base schema](schema.json).
* `options.refs` - Array of referenced schemas.
* `options.defaults` - Default properties used for generating fake data.


## Validation: `clay.validate(json)`
Validate the `attribjson` against the schema.
Returns `undefined` if the data is valid, otherwise an array of errors.


## Validation Errors
A typical error object looks like this:

```js
{
  validation: {
    name: {
      required: true
    }
  }
}
```


## Generate Fake Data: `clay.generate([attributes[, opts]])`
Use this method if you want to get fake data. Utilizes
[json-schema-faker](https://github.com/pateketrueke/json-schema-faker).

If an `attributes` object is provided, its properties will be used instead of
faked values.

Passing `opts` modifies json-schema-faker behaviour:

* `opts.all`: generate fake data for all of the schema's properties, not just required properties.

## `Clay.schema`
Holds the `schema`.


## `Clay.refs`
Holds the `refs`.


## `Clay.defaults`
Holds the `defaults`.


## CLI
Use it to create a simple command line utility which generates fake data:

```js
var Clay = require('json-clay')
var cli = require('json-clay/cli')

var person = new Clay()

cli(person, process.argv.slice(2))
```

Shell usage:

```js
./cli.js
{
  "type": "person",
  "version": "1.2.3"
}
```

Arguments will be added as attributes:

```shell
./cli.js --name Matt
{
  "type": "person",
  "version": "1.2.3",
  "name": "Matt"
}
```

Arguments after `--` will be passed as options to `generate`:

```shell
./cli.js --name Matt -- --all
{
  "type": "person",
  "version": "1.2.3",
  "name": "Matt",
  "age": 27
}
```

## Browserify Build
```sh
npm run build
```

Creates a browserified release in `dist/json-clay.js`.
This build does *not* include the fake data generator.


## Tests
```sh
npm test
```


## Author
© 2015 [eHealth Systems Africa](http://ehealthafrica.org)
