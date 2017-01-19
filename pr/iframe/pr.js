
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
        supportedMethods: ['https://samsung.com/pay'],
        data:{
          productId: 'b30f1a1ea0b244458d5a5b',
          merchantRefId: 'MerchantReferenceId',
          orderNumber: 'AMZ007MAR',
          paymentProtocol: 'PROTOCOL_3DS',
          isRecurring: false,
          merchantName: 'Good Year',
          billingAddressRequired: true,
          allowedCardNetworks:['VISA','MASTERCARD'],
          isDebugMode: false,
	        APIKey: "12345"
          //allowedCardNetworks:cards
          //allowedCardNetworks:['VI','MC','AX','DS']
        }
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
    requestShipping: false,
    requestPayerEmail: false,
    requestPayerPhone: false,
    requestPayerName: false
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

  /*
    // Show UI then continue with user payment info
  request.show().then(result => {
    // POST the result to the server
    return fetch('/pay', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.toJSON())
    }).then(res => {
      // Only if successful
      if (res.status === 200) {
        return res.json();
      } else {
        throw 'Failure';
      }
    }).then(response => {
      // You should have received a JSON object
      if (response.success == true) {
        return result.complete('success');
      } else {
        return result.complete('fail');
      }
    }).then(() => {
      console.log('Thank you!',
          result.shippingAddress.toJSON(),
          result.methodName,
          result.details.toJSON());
    }).catch(() => {
      return result.complete('fail');
    });
  }).catch(function(err) {
    console.error('Uh oh, something bad happened: ' + err.message);
  });
*/
  return request;
}


//var request = buildPaymentRequest();

/**
 * Launches payment request for Bob Pay.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  if (!window.PaymentRequest) {
    error('PaymentRequest API is not supported.');
    return;
  }
  
  //saveUserInputsToStorage();
  
  var request = buildPaymentRequest();
  
  if (!request) {
    error('Developer error: PaymentRequest is invalid.');
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
                  error('SBrowser: ' + err);
                  request = buildPaymentRequest();
                });
          }, 500);
        })
        .catch(function(err) {
          error('SBrowser: ' + err);
          request = buildPaymentRequest();
        });
  } catch (e) {
    error('Developer mistake: \'' + e.message + '\'');
    request = buildPaymentRequest();
  }
}
