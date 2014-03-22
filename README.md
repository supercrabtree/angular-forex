# Angular Forex
Based on the currency filter in Angular. It allows more customisation of the output format and also converts the currencies using the Yahoo finance API.

## Installation

Install to your project using [bower](http://bower.io/)

```shell
bower install angular-forex
```

Include the script in your html.

```html
<script src="bower_components/angular-forex/forex.min.js"></script>
```


## Usage

Include the module in `controllers/app.js`, providing a base currency and settings for each currency you wish to use.

```javascript
angular.module('myApp', 'supercrabtree.Forex'])
  .config(function (ForexProvider) {

    ForexProvider
      .addBaseCurrency('USD', '$')
      .addCurrency('GBP', '£')
      .addCurrency('JPY', '¥', 0)
      .addCurrency('AUD', '$')
      .addCurrency('EUR', '€', 2, ',', '.', true);
  })
```

## License
[MIT License](http://opensource.org/licenses/MIT)
