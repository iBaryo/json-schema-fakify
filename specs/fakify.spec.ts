import {JSONSchema7} from "json-schema";
import {fakify} from "../src/fakify";

describe('fakify', function () {
    it('should not mutate original schema', function () {
        const mockSchema: JSONSchema7 = {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                age: {
                    type: 'number'
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
        };

        function expectDiff(sch1: JSONSchema7, sch2: JSONSchema7) {
            if (typeof sch1 == 'object') {
                expect(sch1).not.toBe(sch2);

                if (sch1.type == 'object' && sch2.type == 'object') {
                    Object.keys(sch1).forEach(prop => expectDiff(sch1[prop], sch2[prop]));
                }
            }
        }

        const res = fakify(mockSchema);
        expectDiff(mockSchema, res);
    });

    it('should default to no fake', function () {
        expect(
            fakify({type: 'string'})
        ).toEqual({type: 'string'});
    });

    it('should ignore name property [too general]', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                }
            }
        } as JSONSchema7);
    });

    it('should add first & last name faker', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    firstName: {
                        type: 'string'
                    },
                    lastName: {
                        type: 'string'
                    },
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                firstName: {
                    type: 'string',
                    faker: 'name.firstName'
                },
                lastName: {
                    type: 'string',
                    faker: 'name.lastName'
                },
            }
        } as JSONSchema7);
    });

    it('should add email faker', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    email: {
                        type: 'string'
                    },
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    faker: 'internet.email'
                },
            }
        } as JSONSchema7);
    });

    it('should handle plural named property as singular', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    emails: {
                        type: 'string'
                    },
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                emails: {
                    type: 'string',
                    faker: 'internet.email'
                },
            }
        } as JSONSchema7);
    });

    it('should add phones faker', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    phones: {
                        type: 'array',
                        items: {
                            type: 'string',
                        }
                    }
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                phones: {
                    type: 'array',
                    items: {
                        type: 'string',
                        faker: 'phone.phoneNumber'
                    }
                }
            }
        } as JSONSchema7);
    });

    it('should add fakers in depth', function () {
        expect(
            fakify({
                type: 'object',
                properties: {
                    d2: {
                        type: 'object',
                        properties: {
                            d3: {
                                type: 'object',
                                properties: {
                                    d4: {
                                        type: 'object',
                                        properties: {
                                            email: {
                                                type: 'string'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        ).toEqual({
            type: 'object',
            properties: {
                d2: {
                    type: 'object',
                    properties: {
                        d3: {
                            type: 'object',
                            properties: {
                                d4: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string',
                                            faker: 'internet.email'
                                        }
                                    }
                                } as JSONSchema7
                            }
                        }
                    }
                }
            }
        });
    });
});
