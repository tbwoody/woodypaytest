
/* global done:false */
/* global error:false */
/* global PaymentRequest:false */
function saveUserInputsToStorage(){
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    var version = document.getElementById('version').value;
    localStorage.setItem("version", version);
	  
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

    var debugKey = document.getElementById('debugKey').value;
    localStorage.setItem("debugKey", debugKey);
    
    var viChecked = JSON.stringify(document.getElementById('VI').checked);
    localStorage.setItem("viChecked", viChecked);
    
    var mcChecked = JSON.stringify(document.getElementById('MC').checked);
    localStorage.setItem("mcChecked", mcChecked);
    
    var axChecked = JSON.stringify(document.getElementById('AX').checked);
    localStorage.setItem("axChecked", axChecked);
    
    var dsChecked = JSON.stringify(document.getElementById('DS').checked);
    localStorage.setItem("dsChecked", dsChecked);
    
    var isRecurring = JSON.stringify(document.getElementById('isRecurring').checked);
    localStorage.setItem("isRecurring", isRecurring);
    
    var billingAddressRequired = JSON.stringify(document.getElementById('billingAddressRequired').checked);
    localStorage.setItem("billingAddressRequired", billingAddressRequired);
	  
    var cardHolderNameRequired = JSON.stringify(document.getElementById('cardHolderNameRequired').checked);
    localStorage.setItem("cardHolderNameRequired", cardHolderNameRequired);
    
    var currencyIndex = document.getElementById('CurrencyCode').selectedIndex;
    localStorage.setItem("CurrencyCode", currencyIndex);
    
    
    var requestShipping = JSON.stringify(document.getElementById('requestShipping').checked);
    localStorage.setItem("requestShipping", requestShipping);
    
    var requestPayerEmail = JSON.stringify(document.getElementById('requestPayerEmail').checked);
    localStorage.setItem("requestPayerEmail", requestPayerEmail);
    
    var requestPayerPhone = JSON.stringify(document.getElementById('requestPayerPhone').checked);
    localStorage.setItem("requestPayerPhone", requestPayerPhone);
    
    var requestPayerName = JSON.stringify(document.getElementById('requestPayerName').checked);
    localStorage.setItem("requestPayerName", requestPayerName);
    
    var totalAmount = document.getElementById('itemTotalEdit').value;
    localStorage.setItem("itemTotalEdit", totalAmount);
    
  } else {
      // Sorry! No Web Storage support..
  }
}

function init(){
  
  //error('loading......');
  
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    document.getElementById('version').value = localStorage.getItem("version");
    document.getElementById('productId').value = localStorage.getItem("productId");
    document.getElementById('merchantRefId').value = localStorage.getItem("merchantRefId");
    document.getElementById('orderNumber').value = localStorage.getItem("orderNumber");
    document.getElementById('merchantName').value = localStorage.getItem("merchantName");
    document.getElementById('debugKey').value = localStorage.getItem("debugKey");
    //document.getElementById('allowedCardBrand').value = localStorage.getItem("allowedCardBrand");
    document.getElementById('paymentProtocol').value = localStorage.getItem("paymentProtocol");
    
    document.getElementById('VI').checked = (localStorage.getItem("viChecked")=='true')?true:false;
    document.getElementById('MC').checked = (localStorage.getItem("mcChecked")=='true')?true:false;
    document.getElementById('AX').checked = (localStorage.getItem("axChecked")=='true')?true:false;
    document.getElementById('DS').checked = (localStorage.getItem("dsChecked")=='true')?true:false;
    
    document.getElementById('isRecurring').checked = (localStorage.getItem("isRecurring")=='true')?true:false;
    document.getElementById('billingAddressRequired').checked = (localStorage.getItem("billingAddressRequired")=='true')?true:false;
    document.getElementById('cardHolderNameRequired').checked = (localStorage.getItem("cardHolderNameRequired")=='true')?true:false;
    
    document.getElementById('CurrencyCode').selectedIndex = localStorage.getItem("CurrencyCode");
    
    
    document.getElementById('requestShipping').checked = (localStorage.getItem("requestShipping")=='true')?true:false;
    document.getElementById('requestPayerEmail').checked = (localStorage.getItem("requestPayerEmail")=='true')?true:false;
    document.getElementById('requestPayerPhone').checked = (localStorage.getItem("requestPayerPhone")=='true')?true:false;
    document.getElementById('requestPayerName').checked = (localStorage.getItem("requestPayerName")=='true')?true:false;
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
    document.getElementById('itemTotalEdit').value = localStorage.getItem("itemTotalEdit");
    if(localStorage.getItem("orderItemsArray") !== null){
      var orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      var orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));
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
  if(!localStorage.getItem("itemTotalEdit")){
      alert('Please provide total amount value.');
      return null;
  }
	
  var currencyOptionBox = document.getElementById('CurrencyCode');
  var currencyText= currencyOptionBox.options[currencyOptionBox.selectedIndex].text;
  
  var total = {};
  total.label = 'Total';
  var amountTotal = {};
  amountTotal.currency = currencyText;
  amountTotal.value = localStorage.getItem("itemTotalEdit");
  total.amount = amountTotal;
  
  
  var displayItems = [];
  var orderItemsList = document.getElementById('orderItemsList').childNodes;
  
  var orderItemsArray = [];
  var orderPricesArray = [];
  if(orderItemsList.length > 0){
    if(typeof(Storage) !== "undefined"){
      //error('Before reading from local storage.');
      
      orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));

      if(orderItemsArray.length == 0){
	 alert('Please provide order detailed items.');
         return null;
      }
      
      for(var i = 0; i < orderItemsArray.length; ++i){
        var item = {};
        item.label = orderItemsArray[i];
        var itemAmount = {};
        itemAmount.currency = currencyText;
        itemAmount.value = orderPricesArray[i];
        item.amount = itemAmount;
        displayItems.push(item);
      }
    } else {
      alert('No internal storage is supported.');
      return null;
    }
  } else {
    alert('No items were found from your order');
    return null;
  }
  
  
  
  var details = {};
  details.total = total;
  details.displayItems = displayItems;
  details.id = "1234567890";
  
  return details;
}


function buildOptions(){
  var shipping = document.getElementById('requestShipping').checked;
  var email = document.getElementById('requestPayerEmail').checked;
  var phone = document.getElementById('requestPayerPhone').checked;
  var name = document.getElementById('requestPayerName').checked;
  
  var options = {
    requestShipping: shipping,
    requestPayerEmail: email,
    requestPayerPhone: phone,
    requestPayerName: name
  };
  
  return options;
}


/**
 * Initializes the payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }
  
  if (localStorage.getItem("supportedMethods") == null) {
    alert('Please provide supported methods.');
    return null;
  }
  
  var cards = [];
  
  var idx = 0;
  if(document.getElementById('VI').checked == true){
    cards[idx] = "visa";
    idx = idx + 1;
  }
  
  if(document.getElementById('MC').checked == true){
    cards[idx] = "mastercard";
    idx = idx + 1;
  }
  
  if(document.getElementById('AX').checked == true){
    cards[idx] = "amex";
    idx = idx + 1;
  }
  
  if(document.getElementById('DS').checked == true){
    cards[idx] = "discover";
    idx = idx + 1;
  }
	
  //error('allowed cards = ' + cards.length);
   if(cards.length == 0){
      alert('Please provide merchant allowed cards.');
      return null;
   }
  
  var supportedMethodsArray = JSON.parse(localStorage.getItem("supportedMethods"));
  if(supportedMethodsArray.length == 0){
      alert('Please provide supported methods.');
      return null;
   }
	
  var supportedInstruments = [
      {
        supportedMethods: supportedMethodsArray,
        data:{
	  version:localStorage.getItem("version"),
          productId: localStorage.getItem("productId"),
          //merchantRefId: 'MerchantReferenceId',
	  merchantGatewayParameter: {userId: localStorage.getItem("merchantRefId")},	
          orderNumber: localStorage.getItem("orderNumber"),
          paymentProtocol: localStorage.getItem("paymentProtocol"),
          isRecurring: document.getElementById('isRecurring').checked,
          merchantName: localStorage.getItem("merchantName"),
          billingAddressRequired: document.getElementById('billingAddressRequired').checked,
	  cardHolderNameRequired: document.getElementById('cardHolderNameRequired').checked,	
          allowedCardNetworks:cards,
          //debug:{APIKey: '6874ad7c7c10403396811780aef9ecf3'}
        }
    }
  ];

  if (localStorage.getItem("debugKey")) {
    var debug = {};
    debug.APIKey = localStorage.getItem("debugKey");
    supportedInstruments[0].data.debug = debug;
  }
  
  var details = buildDetails();
   if(!details){
        return null;
   }

  var options = {
    requestShipping: document.getElementById('requestShipping').checked,
    requestPayerEmail: document.getElementById('requestPayerEmail').checked,
    requestPayerPhone: document.getElementById('requestPayerPhone').checked,
    requestPayerName: document.getElementById('requestPayerName').checked
  };
  
  //var options = buildOptions();

  
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

  return request;
}


//var request = buildPaymentRequest();

/**
 * Launches payment request for Bob Pay.
 */
function onBuyClicked() {  // eslint-disable-line no-unused-vars
  if (!window.PaymentRequest) {
    alert('PaymentRequest API is not supported.');
    return;
  }
  
  saveUserInputsToStorage();
  
  var request = buildPaymentRequest();
  
  if (!request) {
    //alert('Developer error: PaymentRequest is invalid.');
    return;
  }
  

  try {
    request.show()
        .then(function(instrumentResponse) {
          window.setTimeout(function() {
            instrumentResponse.complete('success')
                .then(function() {
                  console.log('Thank you!', JSON.stringify(instrumentResponse));
		    
		  var paymentData = {
		  	// payment method string
		  	"method": instrumentResponse.methodName,
		  	// payment details as you requested
		  	"details": JSON.stringify(instrumentResponse.details),
		  	// shipping address information
		  	"address": JSON.stringify(instrumentResponse.shippingAddress)
	  	  };
		    
		  //console.log(paymentData);
	          //console.log('method = ' + paymentData.method);
		  //console.log('details = ' + paymentData.details);
		  //console.log('address = ' + paymentData.address);
		    
		  if (instrumentResponse.details !='')) {
		      //error('Parsing Details data...'); 
                      $('#nonce').val(instrumentResponse.details.paymentCredential.reference);
		      done('Thank you!', $('#nonce').val());
                  } else {
		       alert('Details is missing from payload.');
		  }
		    
                })
                .catch(function(err) {
                  alert('SBrowser: ' + err);
                  //request = buildPaymentRequest();
                });
          }, 500);
        })
        .catch(function(err) {
          alert('SBrowser: ' + err);
          //request = buildPaymentRequest();
        });
  } catch (e) {
    alert('Developer mistake: \'' + e.message + '\'');
    //request = buildPaymentRequest();
  }
}

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}


function onAddMethodClicked() {
  var ul = document.getElementById("supportedMethodsList");
  var li = document.createElement("li");
  var methodName = document.getElementById('supportedMethods').value;
  
  if(methodName==null || methodName.trim()==""){
    alert('Pleae enter the payment method!');
    return;
  }
  
  var valid = ValidURL(methodName);
  if(valid == false){
    alert("Please enter valid URL.");
    return;
  }
  
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
/*
  var productId = document.getElementById('productId').value;
  var merchantRefId = document.getElementById('merchantRefId').value;
  var orderNumber = document.getElementById('orderNumber').value;
  var paymentProtocol = document.getElementById('paymentProtocol').value;
  var merchantName = document.getElementById('merchantName').value;
  var allowedCardBrand = document.getElementById('allowedCardBrand').value;
  
  
  var isRecurring = document.getElementById('isRecurring').checked;
  var billingAddressRequired = document.getElementById('billingAddressRequired').checked;
 */
  
}

function onClearDataClicked() {
  //var ulElem = document.getElementById('orderItemsList');
  //ulElem.innerHTML = '';
  //ulElem.removeChild(ulElem.childNodes[i])
/*
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
*/
}


function onAddItemClicked() {
  var orderItemsArray = [];
  var orderPricesArray = [];
  
  var itemName = document.getElementById('itemName').value;
  var itemPrice = document.getElementById('itemPrice').value;
  
  if(itemName==null || itemName.trim()==""){
    alert('Pleae enter the item name!');
    return;
  }
  
  if(itemPrice==null || itemPrice.trim()==""){
    alert('Pleae enter the item price!');
    return;
  }
  
  var ul = document.getElementById("orderItemsList");
  var ulArray = ul.childNodes;
  if(ulArray.length > 0){
    if(typeof(Storage) !== "undefined"){
      //error('Before getting existing items.');
      if (localStorage.getItem("orderItemsArray") !== null) {
        orderItemsArray = JSON.parse(localStorage.getItem("orderItemsArray"));
      }
      
      if (localStorage.getItem("orderPricesArray") !== null) {
        orderPricesArray = JSON.parse(localStorage.getItem("orderPricesArray"));
      }
      
      //error('Current orderItemsArray length = ' + orderItemsArray.length);
      //error('Current orderPricesArray length = ' + orderPricesArray.length);
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
  
  //error('Add item name = ' + itemName);
  //error('Add item price = ' + itemPrice);
  //save item to internal storage
  if (typeof(Storage) !== "undefined") {
    
    orderItemsArray.push(itemName);
    localStorage.setItem("orderItemsArray",JSON.stringify(orderItemsArray));
    
    orderPricesArray.push(itemPrice);
    localStorage.setItem("orderPricesArray",JSON.stringify(orderPricesArray));
    
    //error('Number of Names = ' + orderItemsArray.length);
    //error('Number of Prices = ' + orderPricesArray.length);
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
