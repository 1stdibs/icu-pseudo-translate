const { pseudoLetterMap } = require('../src/lib/pseudoLetterMap');
const { pseudoTranslate } = require('../src');
const { parse } = require('@formatjs/icu-messageformat-parser');
const { printAST } = require('@formatjs/icu-messageformat-parser/printer');

function normalize(string) {
    return printAST(parse(string));
}

describe('pseudoLetterMap', () => {
    it('is a Map', () => {
        expect(pseudoLetterMap instanceof Map).toBe(true);
    });
});

describe('translateText fn', () => {
    it('translates text into pseudo translations', () => {
        const test = `Some <link>text</link> <do>Translate <yes>This</yes></do>. There is some unicode in heré! ôØh Nö!`;
        const result = pseudoTranslate(test);
        expect(result).toBe(
            `§ô₥è <link>ƭèxƭ</link> <do>Třáñƨℓáƭè <yes>Thïƨ</yes></do>. Thèřè ïƨ ƨô₥è úñïçôδè ïñ hèřé! ôØh Nö!`
        );
    });
});

describe('pseudoTranslate fn', () => {
    it('translates an ICU message with <link>', () => {
        const testMsg = `Be sure to click on this <link>link right here</link>`;

        const expectedMsg = `ßè ƨúřè ƭô çℓïçƙ ôñ ƭhïƨ <link>ℓïñƙ řïϱhƭ hèřè</link>`;

        const result = pseudoTranslate(testMsg);
        expect(result).toBe(expectedMsg);
    });
    it('translates an ICU message with a {plural}', () => {
        const testMsg = normalize(`On {takenDate, date, short} {name} took {numPhotos, plural,
            =0 {no photos.}
            =1 {one photo.}
            other {# photos.}}`);

        const expectedMsg = normalize(`Óñ {takenDate, date, short} {name} ƭôôƙ {numPhotos, plural,
            =0 {ñô ƥhôƭôƨ.}
            =1 {ôñè ƥhôƭô.}
            other {# ƥhôƭôƨ.}}`);

        const result = pseudoTranslate(testMsg);
        expect(result).toBe(expectedMsg);
    });

    it('translates an ICU message with a {select}', () => {
        const test = normalize(`{taxableArea, select,
            yes {An additional {taxRate, number, percent} tax will be collected.}
            other {No taxes apply.}}`);

        const expected = normalize(`{taxableArea, select,
            yes {Âñ áδδïƭïôñáℓ {taxRate, number, percent} ƭáx ωïℓℓ βè çôℓℓèçƭèδ.}
            other {Nô ƭáxèƨ áƥƥℓ¥.}}`);

        const result = pseudoTranslate(test);
        expect(result).toBe(expected);
    });

    it('translates an ICU message with a {selectordinal}', () => {
        const test = normalize(`It's <Wrapper>my</Wrapper> cat's {year, selectordinal,
            one {#st}
            two {#nd}
            few {#rd}
            other {#th}} birthday!`);

        const expected = normalize(`Ìƭ'ƨ <Wrapper>₥¥</Wrapper> çáƭ'ƨ {year, selectordinal,
            one {#ƨƭ}
            two {#ñδ}
            few {#řδ}
            other {#ƭh}} βïřƭhδá¥!`);

        const result = pseudoTranslate(test);
        expect(result).toBe(expected);
    });

    it('translates this crazy ICU message', () => {
        // from here: http://userguide.icu-project.org/formatparse/messages
        const test = normalize(`
            {gender_of_host, select,
                female {{num_guests, plural,
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to her party.}
                        =2 {{host} invites {guest} and one other person to her party.}
                        other {{host} invites {guest} and # other people to her party.}}}
                male {{num_guests, plural,
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to his party.}
                        =2 {{host} invites {guest} and one other person to his party.}
                        other {{host} invites {guest} and # other people to his party.}}}
                other {{num_guests, plural,
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to their party.}
                        =2 {{host} invites {guest} and one other person to their party.}
                        other {{host} invites {guest} and # other people to their party.}}}}`);

        const expected = normalize(`
            {gender_of_host, select,
                female {{num_guests, plural,
                        =0 {{host} δôèƨ ñôƭ ϱïƲè á ƥářƭ¥.}
                        =1 {{host} ïñƲïƭèƨ {guest} ƭô hèř ƥářƭ¥.}
                        =2 {{host} ïñƲïƭèƨ {guest} áñδ ôñè ôƭhèř ƥèřƨôñ ƭô hèř ƥářƭ¥.}
                        other {{host} ïñƲïƭèƨ {guest} áñδ # ôƭhèř ƥèôƥℓè ƭô hèř ƥářƭ¥.}}}
                male {{num_guests, plural,
                        =0 {{host} δôèƨ ñôƭ ϱïƲè á ƥářƭ¥.}
                        =1 {{host} ïñƲïƭèƨ {guest} ƭô hïƨ ƥářƭ¥.}
                        =2 {{host} ïñƲïƭèƨ {guest} áñδ ôñè ôƭhèř ƥèřƨôñ ƭô hïƨ ƥářƭ¥.}
                        other {{host} ïñƲïƭèƨ {guest} áñδ # ôƭhèř ƥèôƥℓè ƭô hïƨ ƥářƭ¥.}}}
                other {{num_guests, plural,
                        =0 {{host} δôèƨ ñôƭ ϱïƲè á ƥářƭ¥.}
                        =1 {{host} ïñƲïƭèƨ {guest} ƭô ƭhèïř ƥářƭ¥.}
                        =2 {{host} ïñƲïƭèƨ {guest} áñδ ôñè ôƭhèř ƥèřƨôñ ƭô ƭhèïř ƥářƭ¥.}
                        other {{host} ïñƲïƭèƨ {guest} áñδ # ôƭhèř ƥèôƥℓè ƭô ƭhèïř ƥářƭ¥.}}}}`);

        const result = pseudoTranslate(test);
        expect(result).toBe(expected);
    });
});
