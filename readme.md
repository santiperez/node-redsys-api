# node-redsys-api

Node.js Redsys api implementation with new the key-hashed message authentication code (HMAC) SHA256 for the virtual payment gateway integration. This is a node.js port of the PHP API provided by [Redsys](http://www.redsys.es/)

## Installation

	npm install node-redsys-api --save
	
## Examples
```
const Redsys = require('node-redsys-api').Redsys;
...
//Snippet to obtain the signature & merchantParameters
function createPayment(description, total, titular, orderId, paymentId)
{
    const redsys = new Redsys();
    const mParams = {
        "DS_MERCHANT_AMOUNT":common.round(total*100).toString(),
        "DS_MERCHANT_ORDER":paymentId,
        "DS_MERCHANT_MERCHANTCODE":tpvInfo.fucCode,
        "DS_MERCHANT_CURRENCY":tpvInfo.currency,
        "DS_MERCHANT_TRANSACTIONTYPE":tpvInfo.transaction_type,
        "DS_MERCHANT_TERMINAL":tpvInfo.terminal,
        "DS_MERCHANT_MERCHANTURL":domain+tpvInfo.redirect_urls.callbackBasePath+'/'+orderId,
        "DS_MERCHANT_URLOK":domain+tpvInfo.redirect_urls.urlOK+'&id='+orderId,
        "DS_MERCHANT_URLKO":domain+tpvInfo.redirect_urls.urlKO+'&id='+orderId
    };

    return  {signature: redsys.createMerchantSignature(tpvInfo.secret, mParams) , merchantParameters: redsys.createMerchantParameters(mParams), raw: mParams};
}

//Snippet to process the TPV callback
const merchantParams = tpvResponse.Ds_MerchantParameters || tpvResponse.DS_MERCHANTPARAMETERS;
const signature = tpvResponse.Ds_Signature || tpvResponse.DS_SIGNATURE;

const merchantParamsDecoded = redsys.decodeMerchantParameters(merchantParams);
const merchantSignatureNotif = redsys.createMerchantSignatureNotif(tpvInfo.secret, merchantParams);
const dsResponse = parseInt(merchantParamsDecoded.Ds_Response || merchantParamsDecoded.DS_RESPONSE);

if (redsys.merchantSignatureIsValid(signature , merchantSignatureNotif) && dsResponse > -1 && dsResponse < 100 ) {
console.log('TPV payment is OK');
...
} else {
console.log('TPV payment KO');
...
}
```

## Tests
	
	npm run test
	
## Alternative implementations

You can download [Java, PHP, .NET implementations](http://www.redsys.es/#descargas)

## Authors

	Santi Pérez

## License

	MIT
