# JSON-Schema fakifier
Enhance your json-schema with `faker` decorations - to be used with [`json-schema-faker`](https://github.com/json-schema-faker/json-schema-faker).


## Installation
```
npm i json-schema-fakify
```

## Example
```typescript
import {fakify} from "json-schema-fakify";
import * as jsf from "json-schema-faker";
import {JSONSchema7} from "json-schema";

const origin = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        phones: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'string'
            }
        }
    }
} as JSONSchema7;
console.log(`~~~ take your original schema:`, origin);

const fakified = fakify(origin);
console.log(`~~~ fakify it:`, fakified);

console.log(`~~~ then use it to make a fake:`);
jsf.extend('faker', () => require('faker'));
console.log(jsf.generate(fakified));
```


## Contributing
After cloning locally and `npm i`, you can run the following scripts:
```
npm start    // to start the example above
npm run test // test files in spec dir
```
