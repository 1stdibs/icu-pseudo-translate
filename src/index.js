
import { parse } from 'intl-messageformat-parser';

import plMap from './lib/pseudoLetterMap';
import print from './lib/print';

export function translateText(text) {
    let pause = false;
    return text.split('').reduce((str, char) => {
        if (/<|>/.test(char)) {
            pause = !pause;
        }
        if (/[a-zA-Z]/.test(char) && !pause) {
            str += plMap.get(char);
        } else {
            str += char;
        }
        return str;
    }, '');
};

// heavily inspired by:
// https://github.com/yahoo/react-intl/blob/master/examples/translations/scripts/lib/translator.js
export function transform(ast) {
    ast.elements.forEach((el) => {
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

export default function pseudoTranslate(msg) {
    const ast = parse(msg);
    const translated = transform(ast);
    return print(translated);
};
