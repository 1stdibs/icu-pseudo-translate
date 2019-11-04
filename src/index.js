const { parse } = require('intl-messageformat-parser');
const { DomHandler, Parser } = require('htmlparser2');
const serializer = require('dom-serializer');

const { pseudoLetterMap } = require('./lib/pseudoLetterMap');
const { printICUMessage } = require('./lib/printICUMessage');

function translateDom(domArray) {
    return domArray.map(node => {
        if (node.type === 'text') {
            node.data = node.data
                .split('')
                .map(char => pseudoLetterMap.get(char) || char)
                .join('');
        }
        if (node.children) {
            node.children = translateDom(node.children);
        }
        return node;
    });
}

function translateText(text) {
    let pseudoText;
    const handler = new DomHandler((err, domArray) => {
        if (err) {
            throw err;
        }
        pseudoText = serializer(translateDom(domArray));
    });
    const parser = new Parser(handler);
    parser.parseComplete(text);
    return pseudoText;
}

// heavily inspired by:
// https://github.com/yahoo/react-intl/blob/master/examples/translations/scripts/lib/translator.js
function transform(ast) {
    ast.elements.forEach(el => {
        if (el.type === 'messageTextElement') {
            el.value = translateText(el.value);
        } else {
            const options = el.format && el.format.options;
            if (options) {
                options.forEach(option => transform(option.value));
            }
        }
    });
    return ast;
}

function pseudoTranslate(msg) {
    const ast = parse(msg);
    const translated = transform(ast);
    return printICUMessage(translated);
}

module.exports = {
    translateText,
    transform,
    pseudoTranslate,
};
