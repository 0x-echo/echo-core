import { hashString, insertStyle } from './libs/common'
import { AUTH_MESSAGE, DEFAULT_NODE } from './const'
import { sign, generateKeyPair, saveToken, clearToken } from './libs/sign_client'
import { eventEmitter, eventListener } from 'emiter-js'
import { requestLogin } from './libs/login'

export default class {
  constructor({ node, showLog = false, loginAddress } = {}) {
    this.node = node
    this.userInfo = null
    this.showLog = showLog

    this.hasLogined = false
    this.token = ''

    this.localstoragePrefix = `echo_${hashString(this.node)}_`
    this.TOKEN_KEY = `${this.localstoragePrefix}token`
    this.USER_INFO_KEY = `${this.localstoragePrefix}user_info`

    this.loginAddress = loginAddress

    // setTimeout(() => {
    //   eventEmitter.emit('hello', 'world')
    // }, 3000)
    this.loadUserInfo()
    this.appendMessageEl()

    return this
  }

  log() {
    if (this.showLog) {
      console.log('echo:', ...arguments)
    }
  }

  loadUserInfo() {}

  getUserInfo() {
    return this.userInfo
  }

  getToken() {
    return this.token
  }

  async login() {
    await this.metamask()
    return this
  }

  loadUserInfo() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY)
      const userInfo = localStorage.getItem(this.USER_INFO_KEY)
      if (token && userInfo) {
        this.token = token
        this.userInfo = JSON.parse(userInfo)
        this.setLogined()
        this.log('load user info done', this.userInfo)
      } else {
        this.logout()
      }
    } catch (e) {
      this.logout()
    }
  }

  setLogined() {
    this.hasLogined = true
  }

  logout() {
    this.hasLogined = false

    this.userInfo = {}
    localStorage.setItem(this.USER_INFO_KEY, '')
    localStorage.setItem(this.TOKEN_KEY, '')
  }

  appendMessageEl() {
    const id = 'echo-core-message'
    let $message = document.querySelector(`#${id}`)
    if (!$message) {
      $message = document.createElement('div')
      $message.id = id
      document.body.appendChild($message)
    }
    this.$message = $message
  }

  showMessage(type, text, duration = 1500) {
    this.$message.className = ''
    this.$message.classList.add(`echo-${type}`)
    this.$message.innerHTML = text
    this.$message.style.display = 'block'
    setTimeout(() => {
      this.$message.style.display = 'none'
    }, duration)
  }

  async metamask() {
    const getAuthMessage = (chain, address) => {
      const signKeys = generateKeyPair(this.localstoragePrefix)
      return {
        message: AUTH_MESSAGE.replace('ADDRESS', `${chain}/${address}`)
          .replace('TIMESTAMP', new Date().getTime())
          .replace('PUBLIC_KEY', signKeys.publicKey.replace(/^0x/, '')),
        signKeys
      }
    }

    if (window.ethereum) {
      let accounts = []

      try {
        const fullAccounts = await ethereum.request({
          method: 'wallet_requestPermissions',
          params: [ { eth_accounts: {} } ]
        })
        accounts = fullAccounts[0].caveats[0].value
      } catch (e) {
        if (e.code === 4001) {
          throw e
        } else {
          if (!accounts.length) {
            accounts = await ethereum.request({ method: 'eth_accounts' })
          }
        }
      }

      if (!accounts.length) {
        throw new Error('NO WALLET ADDRESS SELECTED')
      }

      const account = accounts[0]

      if (this.loginAddress && this.loginAddress.toLowerCase() !== account.toLowerCase()) {
        this.showMessage('error', `Please choose wallet: ${this.loginAddress} for ECHO authorization`, 5000)
        throw new Error(`PLEASE CHOOSE wallet: ${this.loginAddress} FOR ECHO AUTHORIZATION`)
      }

      const { message, signKeys } = getAuthMessage('EVM', accounts[0])
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [ message, account ]
      })
      const res = await requestLogin({
        account,
        message,
        signature,
        chain: 'EVM',
        signKeys,
        node: this.node,
        localstoragePrefix: this.localstoragePrefix
      })

      if (res.data && res.data.address) {
        this.token = res.data.token
        this.userInfo = res.data
        delete this.userInfo.token

        eventEmitter.emit('post-login', this.userInfo)

        localStorage.setItem(this.TOKEN_KEY, this.token)
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(this.userInfo))
        this.setLogined()

        return true
      }
    } else {
      this.showMessage('error', 'Please install MetaMask first')
    }
  }

  on(event, fn) {
    eventListener.on(event, fn.bind(this))
    return this
  }
}
