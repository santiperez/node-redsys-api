'use strict'

var crypto = require('crypto')
var base64url = require('base64url')

var zeroPad = function zeroPad (buf, blocksize) {
  if (typeof buf === 'string') {
    buf = new Buffer(buf, 'utf8')
  }
  var pad = new Buffer((blocksize - (buf.length % blocksize)) % blocksize)
  pad.fill(0)
  return Buffer.concat([buf, pad])
}

var zeroUnpad = function zeroUnpad (buf, blocksize) {
  var lastIndex = buf.length
  while (lastIndex >= 0 && lastIndex > buf.length - blocksize - 1) {
    lastIndex--
    console.log(buf[lastIndex])
    if (buf[lastIndex] !== 0) {
      break
    }
  }
  return buf.slice(0, lastIndex + 1).toString('utf8')
}

var encrypt3DES = function (str, key) {
  var secretKey = new Buffer(key, 'base64')
  var iv = new Buffer(8)
  iv.fill(0)
  var cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv)
  cipher.setAutoPadding(false)
  var res = cipher.update(zeroPad(str, 8), 'utf8', 'base64') + cipher.final('base64')
  return res
}

var decrypt3DES = function decrypt3DES (str, key) {
  var secretKey = new Buffer(key, 'base64')
  var iv = new Buffer(8)
  iv.fill(0)
  var cipher = crypto.createDecipheriv('des-ede3-cbc', secretKey, iv)
  cipher.setAutoPadding(false)
  var res = cipher.update(zeroUnpad(str, 8), 'base64', 'utf8') + cipher.final('utf8')
  return res.replace(/\0/g, '')
}

var mac256 = function mac256 (data, key) {
  var hexMac256 = crypto.createHmac('sha256', new Buffer(key, 'base64')).update(data).digest('hex')
  return new Buffer(hexMac256, 'hex').toString('base64')
}

var createMerchantParameters = function createMerchantParameters (data) {
  return new Buffer(JSON.stringify(data)).toString('base64')
}

var decodeMerchantParameters = function decodeMerchantParameters (data) {
  var _data = JSON.parse(base64url.decode(data, 'utf8'))
  var res = {}
  for (var name in _data) {
    res[decodeURIComponent(name)] = decodeURIComponent(_data[name])
  }
  return res
}

var createMerchantSignature = function createMerchantSignature (key, data) {
  var _data = createMerchantParameters(data)
  var orderId = (data.Ds_Merchant_Order) ? data.Ds_Merchant_Order : data.DS_MERCHANT_ORDER
  key = encrypt3DES(orderId, key)
  return mac256(_data, key)
}

var createMerchantSignatureNotif = function createMerchantSignatureNotif (key, data) {
  var _data = decodeMerchantParameters(data)
  var orderId = (_data.Ds_Order) ? _data.Ds_Order : _data.DS_ORDER
  key = encrypt3DES(orderId, key)
  var res = mac256(data, key)
  return base64url.encode(res, 'base64')
}

var merchantSignatureIsValid = function merchantSignatureIsValid (signA, signB) {
  return base64url.decode(signA, 'base64') === base64url.decode(signB, 'base64')
}

var Redsys = function () {
  this.encrypt3DES = encrypt3DES
  this.decrypt3DES = decrypt3DES
  this.mac256 = mac256
  this.createMerchantParameters = createMerchantParameters
  this.decodeMerchantParameters = decodeMerchantParameters
  this.createMerchantSignature = createMerchantSignature
  this.createMerchantSignatureNotif = createMerchantSignatureNotif
  this.merchantSignatureIsValid = merchantSignatureIsValid
}

exports.Redsys = Redsys

exports.zeroPad = zeroPad
exports.zeroUnpad = zeroUnpad
exports.encrypt3DES = encrypt3DES
exports.decrypt3DES = decrypt3DES
exports.mac256 = mac256
exports.createMerchantParameters = createMerchantParameters
exports.decodeMerchantParameters = decodeMerchantParameters
exports.createMerchantSignature = createMerchantSignature
exports.createMerchantSignatureNotif = createMerchantSignatureNotif
exports.merchantSignatureIsValid = merchantSignatureIsValid
