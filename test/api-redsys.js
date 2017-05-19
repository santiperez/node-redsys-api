'use strict';

var chai = require('chai');

var Redsys = require('../src/api-redsys').Redsys;
var requestParams = require('./data/request.json');
var responseParams = require('./data/response.json');
var settings = require('./data/settings.json');

var expect = chai.expect;

describe('Node Redsys API tests', () => {
  var redsys;
  before(() => {
    redsys = new Redsys();
  });

  describe('3DES encrypt/decrypt', () => {
    var encryptedText = 'Lr6bLJYWKrk=';
    it('Encrypt Merchant order with 3DES in cbc mode', () => {
      var merchantOrder = requestParams.DS_MERCHANT_ORDER;
      expect(redsys.encrypt3DES(merchantOrder, settings.key))
        .to.be.equals(encryptedText);
    });
    it('Decrypt Merchant order with 3DES in cbc mode', () => {
      expect(redsys.decrypt3DES(encryptedText, settings.key))
        .to.be.equals(requestParams.DS_MERCHANT_ORDER);
    });
  });

  describe('SHA256 algorithm', () => {
    var params = 'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkR' +
    'FUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJ' +
    'DSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjA' +
    'iLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJ' +
    'MIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9';
    var signature = '3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E=';
    var encryptedKey = 'Lr6bLJYWKrk=';

    it('Apply SHA256', () => {
      expect(redsys.mac256(params, encryptedKey))
        .to.be.equals(signature);
    });
  });

  describe('Manage Merchant Parameters', () => {
    var params = 'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkR' +
    'FUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJ' +
    'DSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjA' +
    'iLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJ' +
    'MIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9';

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
      Ds_AuthorisationCode: '082150' };

    it('Create Merchant Parameters', () => {
      expect(redsys.createMerchantParameters(requestParams))
        .to.be.equals(params);
    });

    it('Decode Merchant Parameters', () => {
      var merchantParameters = responseParams.Ds_MerchantParameters;
      expect(redsys.decodeMerchantParameters(merchantParameters))
        .to.be.deep.equals(decodedParams);
    });

  });

  describe('Manage Merchant Signature', () => {
    it('Create Merchant Signature', () => {
      var signature = '3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E=';
      expect(redsys.createMerchantSignature(settings.key, requestParams))
        .to.be.equals(signature);
    });

    it('Create Merchant Signature Notification', () => {
      var merchantSignatureNotif = redsys.createMerchantSignatureNotif(
        settings.key, responseParams.Ds_MerchantParameters) + '=';
      expect(merchantSignatureNotif).to.be.equals(responseParams.Ds_Signature);
    });

    it('Merchant Signature Is Valid', () => {
      const signature = responseParams.Ds_Signature;
      const expectedSignature = '6DVpRPAPoChZh2cgaWnLqlfFsKeXdRfAO_tz-UrxJcU';
      expect(redsys.merchantSignatureIsValid(signature, expectedSignature))
        .to.be.equals(true);
    });
  });
});
