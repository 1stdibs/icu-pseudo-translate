# icu-pseudo-translate

Třáñƨℓáƭè ÌÇÛ ₥èƨƨáϱè ƨƭřïñϱƨ ïñƭô ƥƨèδúô-ƭřáñƨℓáƭèδ ÌÇÛ ₥èƨƨáϱè ƨƭřïñϱƨ.

## install
```
yarn add icu-pseudo-translate
```

## use

```js
import pseudoTranslate from 'icu-message-strings';
// or const pseudoTranslate = require('icu-pseudo-translate').default;

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