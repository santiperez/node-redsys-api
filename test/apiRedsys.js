var chai = require('chai');
var sinon = require('sinon');
var sinon_chai = require('sinon-chai');
var Redsys = require('../src/apiRedsys').Redsys;
var requestParams=require('./data/request.json');
var settings=require('./data/settings.json');
console.log(requestParams.DS_MERCHANT_ORDER);

chai.use(sinon_chai);
var should = chai.should();
redsys = null;


describe("Redsys API", function() {
    before(function() {
        return this.redsys = new Redsys();
    });
    describe("3DES encrypt/decrypt", function() {
        var encryptedText="Lr6bLJYWKrk=";
        it("Encrypt Merchant order with 3DES in cbc mode", function() {
            return this.redsys.encrypt3DES(requestParams.DS_MERCHANT_ORDER,settings.key).should.equal(encryptedText);
        });
        it("Decrypt Merchant order with 3DES in cbc mode", function() {
            return this.redsys.decrypt3DES(encryptedText,settings.key).should.equal(requestParams.DS_MERCHANT_ORDER);
        });
    });
    describe("SHA256 algorithm", function() {
        var params='eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkRFUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJDSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjAiLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJMIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9';
        var signature='3TEI5WyvHf1D/whByt1ENgFH/HPIP9UFuB6LkCYgj+E=';
        var encryptedKey="Lr6bLJYWKrk=";

        it("Apply SHA256", function() {
            return this.redsys.mac256(params,encryptedKey).should.equal(signature);
        });
    });
    describe("Manage Merchant Parameters", function() {
        var params='eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9PUkRFUiI6IjEiLCJEU19NRVJDSEFOVF9NRVJDSEFOVENPREUiOiI5OTkwMDg4ODEiLCJEU19NRVJDSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX1RSQU5TQUNUSU9OVFlQRSI6IjAiLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6Ijg3MSIsIkRTX01FUkNIQU5UX01FUkNIQU5UVVJMIjoiIiwiRFNfTUVSQ0hBTlRfVVJMT0siOiIiLCJEU19NRVJDSEFOVF9VUkxLTyI6IiJ9';

        it("Create Merchant Parameters", function() {
            return this.redsys.createMerchantParameters(requestParams).should.equal(params);
        });
    });
});
