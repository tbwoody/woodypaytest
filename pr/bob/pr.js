/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

/**
 * Initializes the payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }

  var supportedInstruments = [
    {
      supportedMethods: ['https://rsolomakhin.github.io/bobpay']
    }
  ];

  var details = {
    total: {label: 'Donation', amount: {currency: 'USD', value: '95.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'}
      },
      {
        label: 'Note 7',
        amount: {currency: 'USD', value: '10.00'}
      },
      {
        label: 'Note 5',
        amount: {currency: 'USD', value: '10.00'}
      },
      {
        label: 'S7',
        amount: {currency: 'USD', value: '10.00'}
      },
      {
        label: 'S6',
        amount: {currency: 'USD', value: '10.00'}
      },
      {
        label: 'iphone 6s plus',
        amount: {currency: 'USD', value: '0.00'}
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'}
      }
    ]
  };

  var options = {
    requestShipping: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestPayerName: true
  };

  
  var request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details, options);
    if (request.canMakeActivePayment) {
      request.canMakeActivePayment().then(function(result) {
        info(result ? "Can make active payment" : "Cannot make active payment");
      }).catch(function(err) {
        error(err);
      });
    }
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
  }

  return request;
}


var request = buildPaymentRequest();


// When user selects a shipping address
request.addEventListener('shippingaddresschange', e => {
  e.updateWith(((details, addr) => {
    var shippingOption = {
      id: '',
      label: '',
      amount: { currency: 'USD', value: '0.00' },
      selected: true
    };
    // Shipping to US is supported
    if (addr.country === 'US') {
      shippingOption.id = 'us';
      shippingOption.label = 'Standard shipping in US';
      shippingOption.amount.value = '0.00';
      details.total.amount.value = '55.00';
    // Shipping to JP is supported
    } else if (addr.country === 'JP') {
      shippingOption.id = 'jp';
      shippingOption.label = 'International shipping';
      shippingOption.amount.value = '10.00';
      details.total.amount.value = '65.00';
    // Shipping to elsewhere is unsupported
    } else {
      // Empty array indicates rejection of the address
      details.shippingOptions = [];
      return Promise.resolve(details);
    }
    // Hardcode for simplicity
    if (details.displayItems.length === 2) {
      details.displayItems[2] = shippingOption;
    } else {
      details.displayItems.push(shippingOption);
    }
    details.shippingOptions = [shippingOption];

    return Promise.resolve(details);
  })(details, request.shippingAddress));
});

// When user selects a shipping option
request.addEventListener('shippingoptionchange', e => {
  e.updateWith(((details) => {
    // There should be only one option. Do nothing.
    return Promise.resolve(details);
  })(details));
});


/**
 * Launches payment request for Bob Pay.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  if (!window.PaymentRequest || !request) {
    error('PaymentRequest API is not supported.');
    return;
  }

  try {
    request.show()
        .then(function(instrumentResponse) {
          window.setTimeout(function() {
            instrumentResponse.complete('success')
                .then(function() {
                  done('Thank you!', instrumentResponse);
                })
                .catch(function(err) {
                  error(err);
                  request = buildPaymentRequest();
                });
          }, 500);
        })
        .catch(function(err) {
          error(err);
          request = buildPaymentRequest();
        });
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
    request = buildPaymentRequest();
  }
}
