# icu-pseudo-translate

Třáñƨℓáƭè ÌÇÛ ₥èƨƨáϱè ƨƭřïñϱƨ ïñƭô ƥƨèδúô-ƭřáñƨℓáƭèδ ÌÇÛ ₥èƨƨáϱè ƨƭřïñϱƨ.

## install
```sh
yarn add icu-pseudo-translate
# or, probably..
yarn add icu-pseudo-translate --dev
```

## use

```js
import { pseudoTranslate } from 'icu-pseudo-translate';
// or 
const { pseudoTranslate } = require('icu-pseudo-translate');

pseudoTranslate(`On {takenDate, date, short} {name} took {numPhotos, plural,
    =0 {no photos.}
    =1 {one photo.}
    other {# photos.}}`
);
/**
outputs
`Óñ {takenDate, date, short} {name} ƭôôƙ {numPhotos, plural, 
    =0 {ñô ƥhôƭôƨ.}
    =1 {ôñè ƥhôƭô.} 
    other {# ƥhôƭôƨ.}}`
*/
```

#### credits
* translator and printer taken largely from [yahoo/react-intl examples](https://github.com/yahoo/react-intl/tree/master/examples/translations)
* character map from [mr-White/gulp-pseudo-translate-angular-json](https://github.com/mr-white/gulp-pseudo-translate-angular-json)