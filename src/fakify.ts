import {JSONSchema7} from "json-schema";
import * as fakerLib from "faker";
import {singular} from "pluralize";
import {defaultSchemaPropFakers} from "./DefaultPropFakers";

export function fakify(schema: JSONSchema7, propName?: string) {
    if (schema.type == 'array') {
        return {
            ...schema,
            ...{
                items:
                    typeof schema.items == 'boolean' ? schema.items :
                        schema.items instanceof Array ?
                            schema.items.map(i => typeof i == 'boolean' ? i : fakify(i, propName))
                            : fakify(schema.items, propName)
            }
        };
    } else if (schema.type != 'object') {
        return {
            ...schema,
            ...getFaker(propName, schema)
        };
    } else {
        return {
            ...schema,
            ...{
                properties: Object.fromEntries(
                    Object.entries(schema.properties)
                        .map(([propName, schema]) => [
                            propName,
                            typeof schema == 'boolean' ? schema : fakify(schema, propName)
                        ])
                )
            }
        };
    }
}

function getFaker(propName: string, schema: JSONSchema7) {
    propName = singular(propName || '');
    const faker = schema['faker'] || getFakerLibName(defaultSchemaPropFakers[propName] || propName);
    return !faker ? undefined : {faker};
}

function getFakerLibName(prop: string) {
    const [categoryName] =
        Object.entries(fakerLib)
            .filter(([categoryName, category]) =>
                categoryName != 'definitions' && typeof category != 'function') // faker internals
            .find(([_, category]) => category[prop]) || [];
    return categoryName ? `${categoryName}.${prop}` : undefined;
}

