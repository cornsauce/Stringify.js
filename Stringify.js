/**
 * Stringify.js
 * 
 * @author Cornsauce
 * @license MIT
 * 
 */

const TYPE_OBJECT = Symbol('object');
const TYPE_ARRAY = Symbol('array');
const TYPE_STRING = Symbol('string');
const TYPE_NUMBER = Symbol('number');
const TYPE_BOOLEAN = Symbol('boolean');
const TYPE_FUNCTION = Symbol('function');
const TYPE_SYMBOL = Symbol('symbol');
const TYPE_NULL = Symbol('null');
const TYPE_UNDEFINED = Symbol('undefined');
const TYPE_UNKNOWN = Symbol('unknown');
const TYPE_PROPERTY = Symbol('property');

class Stringify {

    static buildObjectAST(value) {
        let children = [];
        for (let prop in value) {
            if (value.hasOwnProperty(prop)) {
                children.push([
                    Stringify.buildValueAST(prop),
                    { type: TYPE_PROPERTY, value: null, label: '', children: [Stringify.buildValueAST(value[prop])] }
                ]);
            }
        }
        return { type: TYPE_OBJECT, value: null, label: '', children };
    }

    static buildArrayAST(value) {
        let children = [];
        for (let i = 0; i < value.length; i++) {
            children.push([
                { type: TYPE_NUMBER, value: i, label: '' + i, children: [] },
                { type: TYPE_PROPERTY, value: null, label: '', children: [Stringify.buildValueAST(value[i])] }
            ]);
        }
        return { type: TYPE_ARRAY, value: null, label: '', children };
    }

    static buildStringAST(value) {
        return { type: TYPE_STRING, value, label: value, children: [] };
    }

    static buildNumberAST(value) {
        return { type: TYPE_NUMBER, value, label: value.toString(), children: [] };
    }

    static buildBooleanAST(value) {
        return { type: TYPE_BOOLEAN, value, label: value ? 'true' : 'false', children: [] };
    }

    static buildFunctionAST(value) {
        return { type: TYPE_FUNCTION, value, label: '@' + (value.name || '<lambda>'), children: [] };
    }

    static buildNullAST() {
        return { type: TYPE_NULL, value: null, label: 'null', children: [] };
    }

    static buildUndefinedAST() {
        return { type: TYPE_UNDEFINED, value: void 0, label: 'undefined', children: [] };
    }

    static buildSymbolAST(value) {
        return { type: TYPE_SYMBOL, value, label: value.description, children: [] };
    }

    static buildValueAST(value) {
        let type = typeof value;
        if (type === 'object') {
            if (value === null) {
                return Stringify.buildNullAST();
            } else if (value.constructor === Array) {
                return Stringify.buildArrayAST(value);
            } else if (value.constructor === Object) {
                return Stringify.buildObjectAST(value);
            }
        } else if (type === 'string') {
            return Stringify.buildStringAST(value);
        } else if (type === 'number') {
            return Stringify.buildNumberAST(value);
        } else if (type === 'boolean') {
            return Stringify.buildBooleanAST(value);
        } else if (type === 'function') {
            return Stringify.buildFunctionAST(value);
        } else if (type === 'symbol') {
            return Stringify.buildSymbolAST(value);
        } else if (type === 'undefined') {
            return Stringify.buildUndefinedAST();
        }
        return { type: TYPE_UNKNOWN, value: null, label: 'unknown', children: [] }
    }

    static stringifyObjectAndArrayAST(ast) {
        const prefix = (astType) => astType === TYPE_OBJECT ? '{' : '[';
        const suffix = (astType) => astType === TYPE_OBJECT ? '}: Object' : ']: Array';
        const spacing = '  ';
        let textLines = [];
        textLines.push(prefix(ast.type));
        for (let i = 0; i < ast.children.length; i++) {
            let keyAST = ast.children[i][0];
            let valueAST = ast.children[i][1].children[0];
            let displayKey = '[' + Stringify.stringifyValue(keyAST.value) + ']';
            if (valueAST.type === TYPE_OBJECT || valueAST.type === TYPE_ARRAY) {
                textLines.push(spacing + displayKey + ' = ' + prefix(valueAST.type));
                let temp = Stringify.stringifyObjectAndArrayAST(valueAST);
                temp.shift();
                temp.pop();
                temp.map(line => spacing + line).forEach(line => textLines.push(line))
                textLines.push(spacing + suffix(valueAST.type))
            } else {
                textLines.push(spacing + displayKey + ' = ' + Stringify.stringifyValueAST(valueAST));
            }
        }
        textLines.push(suffix(ast.type));
        return textLines;
    }

    static stringifyStringAST(ast) {
        return [ast.label + ': String'];
    }

    static stringifyNumberAST(ast) {
        return [ast.label + ': Number'];
    }

    static stringifyBooleanAST(ast) {
        return [ast.label + ': Boolean'];
    }

    static stringifyFunctionAST(ast) {
        return ['[' + ast.label + ']: Function'];
    }

    static stringifySymbolAST(ast) {
        return [ast.label + ': Symbol'];
    }

    static stringifyNullAST(ast) {
        return [ast.label + ': NULL'];
    }

    static stringifyUndefinedAST(ast) {
        return [ast.label + ': Undefined'];
    }

    static stringifyUnknownAST(ast) {
        return [ast.label + ': unknown'];
    }

    static stringifyValueAST(ast) {
        switch (ast.type) {
            case TYPE_OBJECT:
                return Stringify.stringifyObjectAndArrayAST(ast);
            case TYPE_ARRAY:
                return Stringify.stringifyObjectAndArrayAST(ast);
            case TYPE_STRING:
                return Stringify.stringifyStringAST(ast);
            case TYPE_NUMBER:
                return Stringify.stringifyNumberAST(ast);
            case TYPE_BOOLEAN:
                return Stringify.stringifyBooleanAST(ast);
            case TYPE_FUNCTION:
                return Stringify.stringifyFunctionAST(ast);
            case TYPE_SYMBOL:
                return Stringify.stringifySymbolAST(ast);
            case TYPE_NULL:
                return Stringify.stringifyNullAST(ast);
            case TYPE_UNDEFINED:
                return Stringify.stringifyUndefinedAST(ast);
            case TYPE_UNKNOWN:
                return Stringify.stringifyUnknownAST(ast);
        }
    }

    static stringifyString(value) {
        let ast = Stringify.buildStringAST(value);
        return [ast.label + ': String'];
    }

    static stringifyNumber(value) {
        let ast = Stringify.buildNumberAST(value);
        return [ast.label + ': Number'];
    }

    static stringifyBoolean(value) {
        let ast = Stringify.buildBooleanAST(value);
        return [(ast.label ? 'True' : 'False') + ': Boolean'];
    }

    static stringifyFunction(value) {
        let ast = Stringify.buildFunctionAST(value);
        return ['[' + ast.label + ']: Function'];
    }

    static stringifyNull() {
        let ast = Stringify.buildNullAST();
        return [ast.label + ': Null'];
    }

    static stringifyUndefined() {
        let ast = Stringify.buildUndefinedAST();
        return [ast.label + ': Undefined'];
    }

    static stringifyArray(value) {
        let ast = Stringify.buildArrayAST(value);
        return Stringify.stringifyObjectAndArrayAST(ast);
    }

    static stringifyObject(value) {
        let ast = Stringify.buildObjectAST(value);
        return Stringify.stringifyObjectAndArrayAST(ast);
    }

    static stringifySymbol(value) {
        let ast = Stringify.buildSymbolAST(value);
        return ['[' + ast.label + ': Symbol]'];
    }

    static stringifyValue(value) {
        let type = typeof value;
        if (type === 'object') {
            if (value === null) {
                return Stringify.stringifyNull();
            } else if (value.constructor === Array) {
                return Stringify.stringifyArray(value);
            } else if (value.constructor === Object) {
                return Stringify.stringifyObject(value);
            }
        } else if (type === 'string') {
            return Stringify.stringifyString(value);
        } else if (type === 'number') {
            return Stringify.stringifyNumber(value);
        } else if (type === 'boolean') {
            return Stringify.stringifyBoolean(value);
        } else if (type === 'function') {
            return Stringify.stringifyFunction(value);
        } else if (type === 'symbol') {
            return Stringify.stringifySymbol(value);
        } else if (type === 'undefined') {
            return Stringify.stringifyUndefined();
        }
        return ['unknown: Unknown'];
    }

    static stringify(value) {
        return Stringify.stringifyValue(value).join('\n');
    }
}

if (typeof define === 'function') {
    if (!!define.amd) {
        define('stringify', function(value) {
            return Stringify.stringify(value);
        })
    }
    if(!!define.cmd) {
        define('stringify', function(value) {
            return Stringify.stringify(value);
        })
    }
}

if(typeof module === 'object') {
    module.exports = {
        stringify: function(value) {
            return Stringify.stringify(value);
        }
    }
}