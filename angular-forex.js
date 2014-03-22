'use strict';

angular.module('supercrabtree.Forex', [])
  .provider('Forex', function () {

    var isReady = { currencies: false };
    var currencyCodes = {all: []};
    var currencies = {all: {}, current: null, base: null};
    var currencyWaiting = '';

    function Currency(code, symbol, precision, decimal, thousands, post) {
      this.code = code;
      this.symbol = symbol;
      this.precision = isInt(precision) ? precision : 2;
      this.decimal = decimal || '.';
      this.thousands = thousands || ',';
      this.post = post || false;
      this.rate = 1;
    }
    function isInt(value) {
      return !isNaN(value) && parseInt(value) === value;
    }
    function addBaseCurrency(code, symbol, precision, decimal, thousands, post) {
      currencyCodes.all.push(code);
      currencies.base = new Currency(code, symbol, precision, decimal, thousands, post);
      addCurrency(code, symbol, precision, decimal, thousands, post);
      /*jshint validthis: true */
      return this;
    }
    function addCurrency(code, symbol, precision, decimal, thousands, post) {
      if (!currencies.base) {
        throw {message: 'You must call ForexProvider.addBaseCurrency before calling ForexProvider.addCurrency'};
      }
      currencies.all[code] = new Currency(code, symbol, precision, decimal, thousands, post);
      /*jshint validthis: true */
      return this;
    }
    function setCurrency(code) {
      if (!isReady) {
        if (code) {
          currencyWaiting = code;
        }
        return;
      }
      currencies.current = currencies.all[code];
    }
    function getAllCurrenciesLength() {
      var count = 0;
      for (var key in currencies.all) {
        count++;
      }
      return count;
    }
    function getConversionRates($http) {
      if (getAllCurrenciesLength() > 1) {
        var url = createConversionURL();
        $http.jsonp(url)
        .success(onGettingConversionRatesSuccess)
        .error(onGettingConversionRatesError);
      }
    }
    function onGettingConversionRatesSuccess(data) {
      isReady.currencies = true;
      convertReturnedRates(data);
      for (var key in currencies.all) {
        if (currencyCodes.all.indexOf(key) === -1) {
          currencyCodes.all.push(key);
        }
      }
      if (currencyWaiting) {
        setCurrency(currencyWaiting);
      }
    }
    function onGettingConversionRatesError(data) {
      console.warn('Forex could not get conversion rates, defaulting to using the base currency');
    }
    function createConversionURL() {
      var middle = '';
      for (var key in currencies.all) {
        var currency = currencies.all[key];
        middle += encodeURIComponent('s=' + currencies.base.code + key + '=X&');
      }
      var start = 'http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D\'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3F';
      var end = 'f%3Dl1n\'%20and%20columns%3D\'rate%2Cname\'&format=json&callback=JSON_CALLBACK';
      return start + middle + end;
    }
    function convertReturnedRates(data) {
      var rates = data.query.results.row;
      for (var i = 0; i < rates.length; i++) {
        var rate = rates[i];
        var name = rate.name.replace(currencies.base.code + ' to ', '');
        currencies.all[name].rate = parseFloat(rate.rate);
      }
    }
    return {
      addBaseCurrency: addBaseCurrency,
      addCurrency: addCurrency,
      setCurrency: setCurrency,
      $get: function ($http) {
        getConversionRates($http);
        return {
          setCurrency: function (code) {
            setCurrency(code);
          },
          currencyCodes: currencyCodes,
          currencies: currencies,
          isReady: isReady
        };
      }
    };
  })

  .filter('forex', ['Forex', function (Forex) {
    return function (input, override) {

      var currency;

      if (!Forex.isReady.currencies) {
        currency = Forex.currencies.base;
      } else if (override) {
        if (Forex.currencies.all[override]) {
          currency = Forex.currencies.all[override];
        } else {
          console.error('Forex: The currency code you have used does not exist');
          return input;
        }
      } else {
        currency = Forex.currencies.current
      }

      var output = input;
      var isNegative = input < 0;

      if (isNegative) {
        output = Math.abs(output);
      }
      output = (output * currency.rate).toFixed(currency.precision);
      var split = output.split('.');
      output = split[0].replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1" + currency.thousands);
      if (currency.precision) {
        output += currency.decimal + split[1];
      }
      if (currency.post) {
        output = output + currency.symbol;
      } else {
        output = currency.symbol + output;
      }
      if (isNegative) {
        output = '-' + output;
      }
      return output;
    };
  }]);
