'use strict'
var chai = require('chai')
var sinon_chai = require('sinon-chai')
var Redsys = require('../src/apiRedsys')
var requestParams = require('./data/request.json')
var responseParams = require('./data/response.json')
var settings = require('./data/settings.json')
console.log(requestParams.DS_MERCHANT_ORDER)

chai.use(sinon_chai)
chai.should()

describe('Node Redsys API tests', function () {
  before(function () {
    this.redsys = new Redsys.Redsys()
    return this.redsys
  })

  describe('3DES encrypt/decrypt', function () {
    var encryptedText = 'Lr6bLJYWKrk='
    it('Encrypt Merchant order with 3DES in cbc mode', function () {
      return this.redsys.encrypt3DES(requestParams.DS_MERCHANT_ORDER, settings.key).should.equal(encryptedText)
    })
    it('Encrypt Merchant order with 3DES in cbc mode', function () {
      return Redsys.encrypt3DES(requestParams.DS_MERCHANT_ORDER, settings.key).should.equal(encryptedText)
    })
    it('Decrypt Merchant order with 3DES in cbc mode', function () {
      return this.redsys.decrypt3DES(encryptedText, settings.key).should.equal(requestParams.DS_MERCHANT_ORDER)
    })
    it('Decrypt Merchant order with 3DES in cbc mode', function () {
      return Redsys.decrypt3DES(encryptedText, settings.key).should.equal(requestParams.DS_MERCHANT_ORDER)
    })
  })

  describe('SHA256 algorithm', function () {
    var params = 'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkRFUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJDSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjAiLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJMIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9'
    var signature = '3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E='
    var encryptedKey = 'Lr6bLJYWKrk='

    it('Apply SHA256', function () {
      return this.redsys.mac256(params, encryptedKey).should.equal(signature)
    })
    it('Apply SHA256', function () {
      return Redsys.mac256(params, encryptedKey).should.equal(signature)
    })
  })

  describe('Manage Merchant Parameters', function () {
    var params = 'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkRFUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJDSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjAiLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJMIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9'
    var decodedParams = { Ds_Date: '09/11/2015',
      Ds_Hour: '18:03',
      Ds_SecurePayment: '0',
      Ds_Card_Country: '724',
      Ds_Amount: '145',
      Ds_Currency: '978',
      Ds_Order: '0069',
      Ds_MerchantCode: '999008881',
      Ds_Terminal: '871',
      Ds_Response: '0000',
      Ds_MerchantData: '',
      Ds_TransactionType: '0',
      Ds_ConsumerLanguage: '1',
    Ds_AuthorisationCode: '082150' }

    it('Create Merchant Parameters', function () {
      return this.redsys.createMerchantParameters(requestParams).should.equal(params)
    })

    it('Decode Merchant Parameters', function () {
      return this.redsys.decodeMerchantParameters(responseParams.Ds_MerchantParameters).should.eql(decodedParams)
    })

    it('Create Merchant Parameters', function () {
      return Redsys.createMerchantParameters(requestParams).should.equal(params)
    })

    it('Decode Merchant Parameters', function () {
      return Redsys.decodeMerchantParameters(responseParams.Ds_MerchantParameters).should.eql(decodedParams)
    })
  })

  describe('Manage Merchant Signature', function () {
    it('Create Merchant Signature', function () {
      var signature = '3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E='
      return this.redsys.createMerchantSignature(settings.key, requestParams).should.eql(signature)
    })

    it('Create Merchant Signature Notification', function () {
      var merchantSignatureNotif = this.redsys.createMerchantSignatureNotif(settings.key, responseParams.Ds_MerchantParameters) + '='
      return merchantSignatureNotif.should.eql(responseParams.Ds_Signature)
    })

    it('Merchant Signature Is Valid', function () {
      return this.redsys.merchantSignatureIsValid(responseParams.Ds_Signature, '6DVpRPAPoChZh2cgaWnLqlfFsKeXdRfAO_tz-UrxJcU').should.eql(true)
    })
    it('Create Merchant Signature', function () {
      var signature = '3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E='
      return Redsys.createMerchantSignature(settings.key, requestParams).should.eql(signature)
    })

    it('Create Merchant Signature Notification', function () {
      var merchantSignatureNotif = Redsys.createMerchantSignatureNotif(settings.key, responseParams.Ds_MerchantParameters) + '='
      return merchantSignatureNotif.should.eql(responseParams.Ds_Signature)
    })

    it('Merchant Signature Is Valid', function () {
      return Redsys.merchantSignatureIsValid(responseParams.Ds_Signature, '6DVpRPAPoChZh2cgaWnLqlfFsKeXdRfAO_tz-UrxJcU').should.eql(true)
    })
  })
})
