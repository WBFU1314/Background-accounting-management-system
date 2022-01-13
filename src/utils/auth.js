
const Token = 'token'

export function setToken (token) {
  window.localStorage.setItem(Token, token)
}

export function getToken () {
  return window.localStorage.getItem(Token)
}

const UserId = 'UserId'

export function setUserId (userId) {
  window.localStorage.setItem(UserId, userId)
}

export function getUserId () {
  return window.localStorage.getItem(UserId)
}

const UserName = 'userName'

export function setUserName (userName) {
  window.localStorage.setItem(UserName, userName)
}

export function getUserName () {
  return window.localStorage.getItem(UserName)
}
