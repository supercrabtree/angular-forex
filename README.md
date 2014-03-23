# Angular Forex
![logo](http://i59.tinypic.com/sywoyr.jpg)  

Based on the built-in currency filter in Angular, but with highly customisable output to allow for different currency types. e.g.
$1,000.00  
-$1,000.00  
¥1000  
1.000,00 €

### [Demo is here](http://supercrabtree.github.io/angular-forex)

Angular Forex will also convert your currencies for you using the Yahoo Finance API, **non-commercial use only,** please read the terms of service [here](http://info.yahoo.com/guidelines/us/yahoo/ydn/ydn-3955.html)

## Installation

Install to your project using [bower](http://bower.io/)

```shell
bower install angular-forex
```

Include the script in your html

```html
<script src="bower_components/angular-forex/angular-forex.js"></script>
```


## Usage

Include the module `supercrabtree.Forex` as a dependency in your app.  
In the `config` function of the app add a base currency, an then any other currencies you want to use.  
Available parameters are: (currencyCode, currencySymbol, decimalAccuracy, decimalMarker, thousandsMarker and symbolAfterValue);  
A full list of available currency codes [here](http://au.finance.yahoo.com/currencies/converter/) (click the browse all dropdown)

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
You can now use the `forex` filter across you application. It will display in the format defined your base currency.
```javascript
{{ value | forex }}
```
To change the currency just inject the `Forex` service into your controller and set the currency currency using one of the currency codes.
```javascript
angular.module('myApp')
  .controller('myCtrl', function (Forex) {
    Forex.setCurrency('JPY');
  });
```
Or you can set the filter on a one time basis by passing a it a parameter
```javascript
{{ value | forex:'JPY' }}
```
All of the currency codes that you added are availible as an array of strings, useful for dropdowns etc.
```javascript
angular.module('myApp')
  .controller('myCtrl', function (Forex) {
    Forex.currencyCodes.all;
  });
```
## License
[MIT License](http://opensource.org/licenses/MIT)

Pull requests welcome!
