const { parse, TYPE } = require('@formatjs/icu-messageformat-parser');
const { printAST } = require('@formatjs/icu-messageformat-parser/printer');

const { pseudoLetterMap } = require('./lib/pseudoLetterMap');


function translateText(text) {
    return (text || '').split('').map(char => pseudoLetterMap.get(char) || char).join('');
}

function transform(elements) {
    for (const el of elements) {
        if (el.type === TYPE.literal) {
            el.value = translateText(el.value);
        };
        if (el.options) {
            for (const [key, option] of Object.entries(el.options)) {
                el.options[key].value = transform(option.value);
            }
        }
        if (el.children) {
            el.children = transform(el.children);
        }
    }
    return elements;
}

function pseudoTranslate(msg) {
    const ast = parse(msg);
    const translated = transform(ast);
    return printAST(translated);
}

module.exports = {
    transform,
    pseudoTranslate,
};
