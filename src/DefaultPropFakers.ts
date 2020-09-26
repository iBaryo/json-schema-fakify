import FakerStatic = Faker.FakerStatic;

type Values2ndDepth<T extends object, K extends keyof T = keyof T> =
    K extends keyof T ? T[K] extends object ? keyof T[K] : never : never;

export const defaultSchemaPropFakers: {[schemaFieldName: string]: Values2ndDepth<FakerStatic>} = {
    phone: 'phoneNumber'
};
