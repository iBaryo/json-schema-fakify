import {JSONSchema7} from "json-schema";
import * as fakerLibFull from "faker";
import {singular} from "pluralize";
import {defaultSchemaPropFakers} from "./DefaultPropFakers";

export type JSONSchemaFaker = JSONSchema7 & {faker?: string};

const fakerLib = Object.fromEntries(
    Object.entries(fakerLibFull)
        .filter(([categoryName, category]) =>
            categoryName != 'definitions' && typeof category != 'function') // faker internals
);

export function fakify(schema: JSONSchemaFaker, propName?: string): JSONSchema7 {
    return {
        ...schema,
        ...enhanceFaker(schema, propName)
    };
}

function enhanceFaker(schema: JSONSchemaFaker, propName: string): JSONSchemaFaker {
    if (schema.type == 'array') {
        return {
            items: typeof schema.items == 'boolean' ? schema.items :
                    schema.items instanceof Array ?
                        schema.items.map(subSchema => typeof subSchema == 'boolean' ? subSchema : fakify(subSchema, propName))
                        : fakify(schema.items, propName)
        };
    } else if (schema.type != 'object') {
        const faker = getFakerName(schema, propName);
        return faker ? {faker} : undefined;
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

function getFakerName(schema: JSONSchemaFaker, propName: string) {
    propName = singular(propName || '');
    return schema.faker || getFakerLibName(defaultSchemaPropFakers[propName] || propName);
}

function getFakerLibName(prop: string) {
    const [categoryName] =
        Object.entries(fakerLib).find(([_, category]) => category[prop]) || [];
    return categoryName ? `${categoryName}.${prop}` : undefined;
}

