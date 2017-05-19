'use strict';

var crypto = require('crypto');
var base64url = require('base64url');

var utils = require('./utils');

const zeroPad = utils.zeroPad;
const zeroUnpad = utils.zeroUnpad;

class Redsys {
  encrypt3DES(str, key) {
    var secretKey = new Buffer(key, 'base64');
    var iv = new Buffer(8);
    iv.fill(0);
    var cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv);
    cipher.setAutoPadding(false);
    var res = cipher.update(zeroPad(str, 8), 'utf8', 'base64') +
     cipher.final('base64');
    return res;
  }

  decrypt3DES(str, key) {
    var secretKey = new Buffer(key, 'base64');
    var iv = new Buffer(8);
    iv.fill(0);
    var cipher = crypto.createDecipheriv('des-ede3-cbc', secretKey, iv);
    cipher.setAutoPadding(false);
    var res = cipher.update(zeroUnpad(str, 8), 'base64', 'utf8') +
     cipher.final('utf8');
    return res.replace(/\0/g, '');
  }

  mac256(data, key) {
    var hexMac256 = crypto.createHmac('sha256', new Buffer(key, 'base64'))
    .update(data)
    .digest('hex');
    return new Buffer(hexMac256, 'hex').toString('base64');
  }

  createMerchantParameters(data) {
    return new Buffer(JSON.stringify(data)).toString('base64');
  }

  decodeMerchantParameters(data) {
    var _data = JSON.parse(base64url.decode(data, 'utf8'));
    var res = {};
    for (var name in _data) {
      res[decodeURIComponent(name)] = decodeURIComponent(_data[name]);
    }
    return res;
  }

  createMerchantSignature(key, data) {
    var _data = this.createMerchantParameters(data);
    var orderId = data.Ds_Merchant_Order || data.DS_MERCHANT_ORDER;
    key = this.encrypt3DES(orderId, key);
    return this.mac256(_data, key);
  }

  createMerchantSignatureNotif(key, data) {
    var _data = this.decodeMerchantParameters(data);
    var orderId = (_data.Ds_Order) ? _data.Ds_Order : _data.DS_ORDER;
    key = this.encrypt3DES(orderId, key);
    var res = this.mac256(data, key);
    return base64url.encode(res, 'base64');
  }

  merchantSignatureIsValid(signA, signB) {
    return base64url.decode(signA, 'base64') ==
     base64url.decode(signB, 'base64');
  }
}

module.exports = {
  Redsys: Redsys
};
