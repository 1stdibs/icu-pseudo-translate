import { parse } from 'intl-messageformat-parser';
import { DomHandler, Parser } from 'htmlparser2';
import serializer from 'dom-serializer';

import { pseudoLetterMap } from './lib/pseudoLetterMap';
import { printICUMessage } from './lib/printICUMessage';

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

export function translateText(text) {
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
export function transform(ast) {
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

export function pseudoTranslate(msg) {
    const ast = parse(msg);
    const translated = transform(ast);
    return printICUMessage(translated);
}
