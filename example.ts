import * as jsf from "json-schema-faker";
import {JSONSchema7} from "json-schema";
import {fakify} from "./index";

console.log(`~~~ starting...`);
const origin = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
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
            items: {
                type: 'string'

            }
        }
    }
} as JSONSchema7;
console.log(`origin:`, origin);
const fakified = fakify(origin);

console.log(`fakified:`, fakified);

jsf.extend('faker', () => require('faker'));

console.log(`result: `);
// console.log(jsf.generate(fakified));
jsf.resolve(fakified).then(console.log);

