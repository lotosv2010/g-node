# jwt

## 什么是jwt

- JWT (JSON WEB TOKEN) 是目前最流行的跨域身份验证解决方案
- 解决问题：session不支持分布式架构，无法支持横向扩展，只能通过数据库来保存回话数据来实现共享，如果持久层失败会出现认证失败
- 优点：服务器不保存任何会话数据，即服务器变成无状态，使其更容易扩展

## jwt组成

- header 头部

```js
{"alg": "HS256", "typ": "JWT"}
// alg => algorithm => HMAC SHA256
// typ => type => JWT
```

- payload 负载、载荷

```js
// JWT 规定了7个官方字段
// iss(issuer):签发人
// exp(expiration time):过期时间
// sub(subject):主题
// aud(audience):受众
// nbf(Not Before):生效时间
// iat(Issued At):签发时间
// jti(JET ID):编号
```

- signature 签名，对前两部分的签名，防止数据篡改

```js
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## 注意

- JWT 作为一个令牌(token)，有些场合可能会放到URL(比如：api.example.com/?token=xxx)。
- base64有三个字符 `+` 、`/`、`=` ，在URL里面有特殊含义，所以要被替换掉：`=` 被省略、`+`替换成 `-`、`/`替换成 `_`。这就是base64URL算法。
