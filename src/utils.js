'use strict';

function zeroPad(buf, blocksize) {
  if (typeof buf === 'string') {
    buf = Buffer.from(buf, 'utf8');
  }
  var pad = Buffer.alloc((blocksize - (buf.length % blocksize)) % blocksize, 0);
  return Buffer.concat([buf, pad]);
}

function zeroUnpad(buf, blocksize) {
  var lastIndex = buf.length;
  while (lastIndex >= 0 && lastIndex > buf.length - blocksize - 1) {
    lastIndex--;
    if (buf[lastIndex] != 0) {
      break;
    }
  }
  return buf.slice(0, lastIndex + 1).toString('utf8');
}

module.exports = {
  zeroPad,
  zeroUnpad,
};
