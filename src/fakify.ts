import {JSONSchema7} from "json-schema";
import * as fakerLibFull from "faker";
import {singular} from "pluralize";
import {defaultSchemaPropFakers} from "./DefaultPropFakers";

const fakerLib = Object.fromEntries(
    Object.entries(fakerLibFull)
        .filter(([categoryName, category]) =>
            categoryName != 'definitions' && typeof category != 'function') // faker internals
);

export function fakify(schema: JSONSchema7, propName?: string) {
    return {
        ...schema,
        ...enhanceFaker(schema, propName)
    };
}

function enhanceFaker(schema: JSONSchema7, propName: string) {
    if (schema.type == 'array') {
        return {
            items: typeof schema.items == 'boolean' ? schema.items :
                    schema.items instanceof Array ?
                        schema.items.map(subSchema => typeof subSchema == 'boolean' ? subSchema : fakify(subSchema, propName))
                        : fakify(schema.items, propName)
        };
    } else if (schema.type != 'object') {
        const faker = getFakerName(schema, propName);
        return !faker ? undefined : {faker};
    } else {
        return {
            properties: Object.fromEntries(
                Object.entries(schema.properties)
                    .map(([propName, schema]) => [
                        propName,
                        typeof schema == 'boolean' ? schema : fakify(schema, propName)
                    ])
            )
        };
    }
}

function getFakerName(schema: JSONSchema7, propName: string) {
    propName = singular(propName || '');
    const faker = schema['faker'] || getFakerLibName(defaultSchemaPropFakers[propName] || propName);
    return faker;
}

function getFakerLibName(prop: string) {
    const [categoryName] =
        Object.entries(fakerLib).find(([_, category]) => category[prop]) || [];
    return categoryName ? `${categoryName}.${prop}` : undefined;
}

