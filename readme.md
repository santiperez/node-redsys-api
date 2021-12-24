# node-redsys-api

Node.js Redsys api implementation with new the key-hashed message authentication code (HMAC) SHA256 for the virtual payment gateway integration. This is a node.js port of the PHP API provided by [Redsys](http://www.redsys.es/)

## Installation

	npm install node-redsys-api --save
	
## Examples

### Obtain signature and merchant parameters

```js
const Redsys = require('node-redsys-api').Redsys;

function createPayment(description, total, titular, orderId, paymentId) {
  const redsys = new Redsys();
  const mParams = {
    DS_MERCHANT_AMOUNT: total,
    DS_MERCHANT_ORDER: paymentId,
    DS_MERCHANT_MERCHANTCODE: TPVConfig.fucCode,
    DS_MERCHANT_CURRENCY: TPVConfig.currency,
    DS_MERCHANT_TRANSACTIONTYPE: TPVConfig.transaction_type,
    DS_MERCHANT_TERMINAL: TPVConfig.terminal,
    DS_MERCHANT_MERCHANTURL: `${baseDomain + TPVConfig.redirect_urls.callbackBasePath}/${orderId}`,
    DS_MERCHANT_URLOK: `${baseDomain + TPVConfig.redirectPaths.OK}&id=${orderId}`,
    DS_MERCHANT_URLKO: `${baseDomain + TPVConfig.redirectPaths.KO}&id=${orderId}`,
  };

  return { signature: redsys.createMerchantSignature(TPVConfig.secret, mParams), merchantParameters: redsys.createMerchantParameters(mParams), raw: mParams };
}
```

### Process TPV callback

```js
const merchantParams = response.Ds_MerchantParameters || response.DS_MERCHANTPARAMETERS;
const signature = response.Ds_Signature || response.DS_SIGNATURE;

const merchantParamsDecoded = redsys.decodeMerchantParameters(merchantParams);
const merchantSignatureNotif = redsys.createMerchantSignatureNotif(TPVConfig.secret, merchantParams);
const dsResponse = parseInt(merchantParamsDecoded.Ds_Response || merchantParamsDecoded.DS_RESPONSE, 10);

if (redsys.merchantSignatureIsValid(signature, merchantSignatureNotif) && dsResponse > -1 && dsResponse < 100) {
/* TPV payment is OK;
... */
} else {
/* 'TPV payment is KO;
... */
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
