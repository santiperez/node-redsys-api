var crypto = require('crypto');

var  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Redsys = (function() {

    function Redsys() {
        this.encrypt3DES = bind(this.encrypt3DES, this);
        this.decrypt3DES = bind(this.decrypt3DES, this);
        this.mac256 = bind(this.mac256, this);
        this.createMerchantParameters = bind(this.createMerchantParameters, this);
    }

    Redsys.prototype.encrypt3DES = function (str,key) {
        var secretKey = new Buffer(key, 'base64');
        var iv = new Buffer(8);
        iv.fill(0);
        var cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv);
        cipher.setAutoPadding(false);
        var res=cipher.update(zeroPad(str, 8), 'utf8', 'base64') + cipher.final('base64');
        return res;
    }

    Redsys.prototype.decrypt3DES = function(str,key) {
        var secretKey = new Buffer(key, 'base64');
        var iv = new Buffer(8);
        iv.fill(0);
        var cipher = crypto.createDecipheriv('des-ede3-cbc', secretKey, iv);
        cipher.setAutoPadding(false);
        var res=cipher.update(zeroUnpad(str, 8), 'base64', 'utf8') + cipher.final('utf8');
        return res.replace(/\0/g, '');
    }

    Redsys.prototype.mac256 = function(data,key) {
        var hexMac256 = crypto.createHmac("sha256", new Buffer(key, 'base64')).update(data).digest("hex");
        return new Buffer(hexMac256, 'hex').toString('base64');
    }

    Redsys.prototype.createMerchantParameters = function(data) {
        return new Buffer(JSON.stringify(data)).toString('base64');
    }

    function zeroPad(buf, blocksize) {
        if (typeof buf === "string") {
            buf = new Buffer(buf, "utf8");
        }
        var pad = new Buffer((blocksize - (buf.length % blocksize)) % blocksize);
        pad.fill(0);
        return Buffer.concat([buf, pad]);
    }

    function zeroUnpad(buf, blocksize) {
        var lastIndex = buf.length;
        while (lastIndex >= 0 && lastIndex > buf.length - blocksize - 1) {
            lastIndex--;
            console.log(buf[lastIndex]);
            if (buf[lastIndex] != 0) {
                break;
            }
        }
        return buf.slice(0, lastIndex + 1).toString("utf8");
    }

    return Redsys;

})();

module.exports = {
Redsys: Redsys
};
