/* global done:false */
/* global error:false */
/* global PaymentRequest:false */
function saveUserInputsToStorage(){
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    var productId = document.getElementById('productId').value;
    localStorage.setItem("productId", productId);
    
    var merchantRefId = document.getElementById('merchantRefId').value;
    localStorage.setItem("merchantRefId", merchantRefId);
    
    var orderNumber = document.getElementById('orderNumber').value;
    localStorage.setItem("orderNumber", orderNumber);
    
    var paymentProtocol = document.getElementById('paymentProtocol').value;
    localStorage.setItem("paymentProtocol", paymentProtocol);
    
    var merchantName = document.getElementById('merchantName').value;
    localStorage.setItem("merchantName", merchantName);
    
    var allowedCardBrand = document.getElementById('allowedCardBrand').value;
    localStorage.setItem("allowedCardBrand", allowedCardBrand);
    
    var isRecurring = JSON.stringify(document.getElementById('isRecurring').checked);
    localStorage.setItem("isRecurring", isRecurring);
    
    var billingAddressRequired = JSON.stringify(document.getElementById('billingAddressRequired').checked);
    localStorage.setItem("billingAddressRequired", billingAddressRequired);
    
    ////////////////////////////////////////////////////////////////////////////////////////
    /*
    var supportedMethodsList = document.getElementById('supportedMethodsList').childNodes;
    var supportedMethodsArray = [];
    for( var i = 0; i < supportedMethodsList.length; ++i )
    {
        var method = supportedMethodsList[i];
        supportedMethodsArray.push(method.innerText || method.textContent);
    }
    //localStorage.setItem("supportedMethods", JSON.stringify(list));
    localStorage["supportedMethods"] = JSON.stringify(supportedMethodsArray);
    */
    
    //////////////////////////////////////////////////////////////////////////////////////
    /*
    var orderItemsList = document.getElementById('orderItemsList').childNodes;
    var orderItemsArray = [];
    for( var j = 0; j < orderItemsList.length; ++j )
    {
        var item = orderItemsList[j];
        orderItemsArray.push(item.innerText || item.textContent);
    }
    //localStorage.setItem("supportedMethods", JSON.stringify(list));
    localStorage["orderItems"] = JSON.stringify(orderItemsArray);
    */
    
  } else {
      // Sorry! No Web Storage support..
  }
}

function init(){
  
  error('loading......');
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    document.getElementById('productId').value = localStorage.getItem("productId");
    document.getElementById('merchantRefId').value = localStorage.getItem("merchantRefId");
    document.getElementById('orderNumber').value = localStorage.getItem("orderNumber");
    document.getElementById('merchantName').value = localStorage.getItem("merchantName");
    document.getElementById('allowedCardBrand').value = localStorage.getItem("allowedCardBrand");
    document.getElementById('paymentProtocol').value = localStorage.getItem("paymentProtocol");
    document.getElementById('isRecurring').checked = (localStorage.getItem("isRecurring")=='true')?true:false;
    document.getElementById('billingAddressRequired').checked = (localStorage.getItem("billingAddressRequired")=='true')?true:false;
    
    //////////////////////////////////////////////////////////////////////////////////////
    
    //var supportedMethodsArray = localStorage.getItem("supportedMethods");
    if (localStorage.getItem("supportedMethods") !== null) {
        var supportedMethodsArray = JSON.parse(localStorage.getItem("supportedMethods"));
      
        //var supportedMethodsArray = JSON.parse(localStorage.getItem("supportedMethods"));
        var supportedMethodsList = document.getElementById("supportedMethodsList");
        for(var i = 0; i < supportedMethodsArray.length; i++) {
          var methodLi = document.createElement("li");
          //var methodName = document.getElementById('supportedMethods').value;
          methodLi.appendChild(document.createTextNode(supportedMethodsArray[i]));
          supportedMethodsList.appendChild(methodLi);
        }
    }
    
    //////////////////////////////////////////////////////////////
    
    //var orderItemsArray = JSON.parse(localStorage["orderItems"]);
    if(localStorage.getItem("orderItemsArray") !== null){
      var orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      var orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));

      error('Current orderItemsArray length = ' + orderItemsArray.length);
      error('Current orderPricesArray length = ' + orderPricesArray.length);

      var orderItemsList = document.getElementById("orderItemsList");
      var blank = '\xa0\xa0\xa0\xa0\xa0';

      for(var j = 0; j < orderItemsArray.length; j++) {
        var itemLi = document.createElement("li");
        //var methodName = document.getElementById('supportedMethods').value;
        itemLi.appendChild(document.createTextNode(orderItemsArray[j] + blank + orderPricesArray[j]));
        orderItemsList.appendChild(itemLi);
        //error('add item for order items');
      }
    }
  } else {
      // Sorry! No Web Storage support..
  }
}
window.onload = init;


function buildSupportedInstruments(){
  
}


function buildDetails(){
  error('building the details for payment request.');
  
  var total = {};
  total.label = 'Total';
  var amountTotal = {};
  amountTotal.currency = 'USD';
  amountTotal.value = '100.00';
  total.amount = amountTotal;
  
  
  var displayItems = [];
  var orderItemsList = document.getElementById('orderItemsList').childNodes;
  
  var orderItemsArray = [];
  var orderPricesArray = [];
  if(orderItemsList.length > 0){
    if(typeof(Storage) !== "undefined"){
      error('Before reading from local storage.');
      
      orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));
      
      error('orderItemsArray length = ' + orderItemsArray.length);
      error('orderPricesArray length = ' + orderPricesArray.length);
      
      for(var i = 0; i < orderItemsList.length; ++i){
        var item = {};
        item.label = 'item name';
        var itemAmount = {};
        itemAmount.currency = 'USD';
        itemAmount.value = '3.33';
        item.amount = itemAmount;
        displayItems.push(item);
      }
    } else {
      error('No internal storage is supported.');
    }
  } else {
    error('No items were found from your order');
  }
  
  
  
  var details = {};
  details.total = total;
  details.displayItems = displayItems;
  
  return details;
}


function buildOptions(){
  
}


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
        //allowedCardBrand:['VI','DS']
        allowedCardBrand:['VI','MC','AX','DS']
      }
    }
  ];

  
  //var details = buildDetails();
  
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
  
  var request = buildPaymentRequest();
  
  if (!request) {
    error('Developer error: PaymentRequest is invalid.');
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
  
  var supportedMethodsList = document.getElementById('supportedMethodsList').childNodes;
  var supportedMethodsArray = [];
    for( var i = 0; i < supportedMethodsList.length; ++i )
    {
        var method = supportedMethodsList[i];
        supportedMethodsArray.push(method.innerText || method.textContent);
    }
    //localStorage.setItem("supportedMethods", JSON.stringify(list));
    localStorage.setItem("supportedMethods",JSON.stringify(supportedMethodsArray));
}

function onClearMethodClicked() {
  
  var ulElem = document.getElementById('supportedMethodsList');
  ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
  document.getElementById('supportedMethods').value='';
  
  localStorage.removeItem("supportedMethods");
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
  
  localStorage.removeItem("productId");
  localStorage.removeItem("merchantRefId");
  localStorage.removeItem("orderNumber");
  localStorage.removeItem("paymentProtocol");
  localStorage.removeItem("merchantName");
  localStorage.removeItem("allowedCardBrand");
  localStorage.removeItem("isRecurring");
  localStorage.removeItem("billingAddressRequired");
}


function onAddItemClicked() {
  var orderItemsArray = [];
  var orderPricesArray = [];
  
  var itemName = document.getElementById('itemName').value;
  var itemPrice = document.getElementById('itemPrice').value;
  
  var ul = document.getElementById("orderItemsList");
  var ulArray = ul.childNodes;
  if(ulArray.length > 0){
    if(typeof(Storage) !== "undefined"){
      error('Before getting existing items.');
      if (localStorage.getItem("orderItemsArray") !== null) {
        orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      }
      
      if (localStorage.getItem("orderPricesArray") !== null) {
        orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));
      }
      
      error('Current orderItemsArray length = ' + orderItemsArray.length);
      error('Current orderPricesArray length = ' + orderPricesArray.length);
    } else {
      error('local storage is not supported.');
    }
  } else {
    error('Current length of list is 0.');
  }
  
  
  var li = document.createElement("li");
  var blank = '\xa0\xa0\xa0\xa0\xa0';
  li.appendChild(document.createTextNode(itemName+blank+itemPrice));
  ul.appendChild(li);
  
  document.getElementById('itemName').value='';
  document.getElementById('itemPrice').value='';
  
  error('Add item name = ' + itemName);
  error('Add item price = ' + itemPrice);
  //save item to internal storage
  if (typeof(Storage) !== "undefined") {
    
    orderItemsArray.push(itemName);
    localStorage.setItem("orderItemsArray",JSON.stringify(orderItemsArray));
    
    orderPricesArray.push(itemPrice);
    localStorage.setItem("orderPricesArray",JSON.stringify(orderPricesArray));
    
    error('Number of Names = ' + orderItemsArray.length);
    error('Number of Prices = ' + orderPricesArray.length);
  }
}

function onClearItemClicked() {
  var ulElem = document.getElementById('orderItemsList');
  ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
  document.getElementById('itemName').value='';
  document.getElementById('itemPrice').value='';
  
  localStorage.removeItem("orderItems");
  localStorage.removeItem("orderItemsArray");
  localStorage.removeItem("orderPricesArray");
}
