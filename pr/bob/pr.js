/* global done:false */
/* global error:false */
/* global PaymentRequest:false */
function saveUserInputsToStorage(){
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    var methodName = document.getElementById('supportedMethods').value;
    localStorage.setItem("supportedMethods", methodName);
  } else {
      // Sorry! No Web Storage support..
  }
}

function init(){
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    document.getElementById('supportedMethods').value = localStorage.getItem("supportedMethods");
  } else {
      // Sorry! No Web Storage support..
  }
}
window.onload = init;

/**
 * Initializes the payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }

  var supportedInstruments = [
    {
      supportedMethods: ['https://rsolomakhin.github.io/bobpay','https://tbwoody.github.io/woodypaytest'],
      data:{
        productId: '12345',
        merchantRefId: '1321345154',
        orderNumber: '1002',
        paymentProtocol: 'PROTOCOL_3DS',
        isRecurring: false,
        merchantName: 'ABC Store',
        billingAddressRequired: false,
        allowedCardBrand:['AMEX','MASTERCARD','VISA','DISCOVER']
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


var request = buildPaymentRequest();

/**
 * Launches payment request for Bob Pay.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  if (!window.PaymentRequest || !request) {
    error('PaymentRequest API is not supported.');
    return;
  }
  
  saveUserInputsToStorage();

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

function onAddMethodClicked() {
  var ul = document.getElementById("supportedMethodsList");
  var li = document.createElement("li");
  var methodName = document.getElementById('supportedMethods').value;
  li.appendChild(document.createTextNode(methodName));
  ul.appendChild(li);
  
  document.getElementById('supportedMethods').value='';
}

function onClearMethodClicked() {
  
  var ulElem = document.getElementById('supportedMethodsList');
  ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
  document.getElementById('supportedMethods').value='';
}

function onAddMerchantDataClicked() {
  var productId = document.getElementById('productId').value;
  var merchantRefId = document.getElementById('merchantRefId').value;
  var orderNumber = document.getElementById('orderNumber').value;
  var paymentProtocol = document.getElementById('paymentProtocol').value;
  var merchantName = document.getElementById('merchantName').value;
  var allowedCardBrand = document.getElementById('allowedCardBrand').value;
  
  
  var isRecurring = document.getElementById('isRecurring').checked;
  var billingAddressRequired = document.getElementById('billingAddressRequired').checked;
  
}

function onClearDataClicked() {
  //var ulElem = document.getElementById('orderItemsList');
  //ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
  document.getElementById('productId').value='';
  document.getElementById('merchantRefId').value='';
  document.getElementById('orderNumber').value='';
  document.getElementById('paymentProtocol').value='';
  document.getElementById('merchantName').value='';
  document.getElementById('allowedCardBrand').value='';
  
  document.getElementById('isRecurring').checked=false;
  document.getElementById('billingAddressRequired').checked=false;
}


function onAddItemClicked() {
  var itemName = document.getElementById('itemName').value;
  var itemPrice = document.getElementById('itemPrice').value;
  
  var ul = document.getElementById("orderItemsList");
  var li = document.createElement("li");
  
  li.appendChild(document.createTextNode(itemName+'&nbsp;&nbsp;&nbsp;&nbsp;'+itemPrice));
  ul.appendChild(li);
  
  document.getElementById('itemName').value='';
  document.getElementById('itemPrice').value='';
}

function onClearItemClicked() {
  var ulElem = document.getElementById('orderItemsList');
  ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
  document.getElementById('itemName').value='';
  document.getElementById('itemPrice').value='';
}
