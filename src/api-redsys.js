// TODO Refactor and remove class in 1.0.0 version
/* eslint-disable class-methods-use-this */
const crypto = require('crypto');
const base64url = require('base64url');

const { zeroPad, zeroUnpad } = require('./utils');

class Redsys {
  encrypt3DES(str, key) {
    const secretKey = Buffer.from(key, 'base64');
    const iv = Buffer.alloc(8, 0);
    const cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv);
    cipher.setAutoPadding(false);
    return cipher.update(zeroPad(str, 8), 'utf8', 'base64')
     + cipher.final('base64');
  }

  decrypt3DES(str, key) {
    const secretKey = Buffer.from(key, 'base64');
    const iv = Buffer.alloc(8, 0);
    const cipher = crypto.createDecipheriv('des-ede3-cbc', secretKey, iv);
    cipher.setAutoPadding(false);
    const res = cipher.update(zeroUnpad(str, 8), 'base64', 'utf8')
     + cipher.final('utf8');
    return res.replace(/\0/g, '');
  }

  mac256(data, key) {
    return crypto.createHmac('sha256', Buffer.from(key, 'base64'))
      .update(data)
      .digest('base64');
  }

  createMerchantParameters(data) {
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
  }

  decodeMerchantParameters(data) {
    const decodedData = JSON.parse(base64url.decode(data, 'utf8'));
    const res = {};
    Object.keys(decodedData).forEach((param) => {
      res[decodeURIComponent(param)] = decodeURIComponent(decodedData[param]);
    });
    return res;
  }

  createMerchantSignature(key, data) {
    const merchantParameters = this.createMerchantParameters(data);
    const orderId = data.Ds_Merchant_Order || data.DS_MERCHANT_ORDER;
    const orderKey = this.encrypt3DES(orderId, key);

    return this.mac256(merchantParameters, orderKey);
  }

  createMerchantSignatureNotif(key, data) {
    const merchantParameters = this.decodeMerchantParameters(data);
    const orderId = merchantParameters.Ds_Order || merchantParameters.DS_ORDER;
    const orderKey = this.encrypt3DES(orderId, key);

    const res = this.mac256(data, orderKey);
    return base64url.encode(res, 'base64');
  }

  merchantSignatureIsValid(signA, signB) {
    return base64url.decode(signA, 'base64')
     === base64url.decode(signB, 'base64');
  }
}

module.exports = {
  Redsys,
};
