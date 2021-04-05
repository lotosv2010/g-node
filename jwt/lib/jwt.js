const crypto = require('crypto');
const jwt = {
  toBase64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  },
  toBase64(content) {
    return this.toBase64Url(Buffer.from(JSON.stringify(content)).toString('base64'))
  },
  sign(content, secret) {
    const r = crypto.createHmac('sha256', secret).update(content).digest('base64')
    return this.toBase64Url(r)
  },
  encode(payload, secret) {
    const header = this.toBase64({
      typ: 'JWT',
      alg: 'HS256'
    })
    const content = this.toBase64(payload)
    // 对head 和内容签名
    const sign = this.sign([header, content].join('.'), secret)
    return [header, content, sign].join('.')
  },
  base64URlUnescape(str) {
    str += new Array(5 - str.length % 4).join('=')
    return str.replace(/\-/g, '+').replace(/_/g, '/')
  },
  decode(token, secret) {
    const [header, content, sign] = token.split('.')
    const newSign = this.sign([header, content].join('.'), secret)
    if(sign === newSign) {
      return Buffer.from(this.base64URlUnescape(content), 'base64').toString()
    } else {
      throw new Error('被篡改了')
    }
  }
}
module.exports = jwt