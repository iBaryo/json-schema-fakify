import * as jsf from "json-schema-faker";
import {JSONSchema7} from "json-schema";
import {fakify} from "../index";

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