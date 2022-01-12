function zeroPad(buf, blocksize) {
  const buffer = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : Buffer.from(buf.toString(), 'utf8');
  const pad = Buffer.alloc((blocksize - (buffer.length % blocksize)) % blocksize, 0);
  return Buffer.concat([buffer, pad]);
}

function zeroUnpad(buf, blocksize) {
  let lastIndex = buf.length;
  while (lastIndex >= 0 && lastIndex > buf.length - blocksize - 1) {
    lastIndex -= 1;
    if (buf[lastIndex] !== 0) {
      break;
    }
  }
  return buf.slice(0, lastIndex + 1).toString('utf8');
}

module.exports = {
  zeroPad,
  zeroUnpad,
};
