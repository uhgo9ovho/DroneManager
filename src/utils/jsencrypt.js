import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMKoRcpGZwDYGCY+OqwFAypoZsLI7vOP\n' +
  'XHYPQbLOOjRre7fGZ6ABTVzA1LrjsmlbIDswupaTPYOgX1MtR53Ofl0CAwEAAQ=='

const privateKey = 'MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAwqhFykZnANgYJj46\n' +
  'rAUDKmhmwsju849cdg9Bss46NGt7t8ZnoAFNXMDUuuOyaVsgOzC6lpM9g6BfUy1H\n' +
  'nc5+XQIDAQABAkEAgF8gx2jufOwF4RKg9tjHYaxAOKzyiMU+oM0m8ph2YiJnJkvL\n' +
  '/rxVU6ifYub67X/CDHs4EayTkxFe+Ii2Eu/5MQIhAP4lVnnJuNmiZX3cf9kEk3Ax\n' +
  'UMfbg4ObQRbkYToHzRgrAiEAxBPUWVb00PuMMwxQ9Iru4Mv7W36kIU4OSgJJRwTs\n' +
  'N5cCIQCPgmf9Z4JBKqmi07NByYqz7LUP1g3CcBXmJlocmbEfdwIgaA6N9wuqyO12\n' +
  'LfEvVVgWBb67GodO203tT2F/Oe1m3ukCIQCZPJf8Tf4XZ0/WCr1L1J7RJAyu8Ld/\n' +
  'YXO4pknMk5qLGQ=='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

