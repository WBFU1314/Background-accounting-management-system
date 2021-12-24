
const Token = 'token'

export function setToken (token) {
  window.localStorage.setItem(Token, token)
}

export function getToken () {
  window.localStorage.getItem(Token)
}
