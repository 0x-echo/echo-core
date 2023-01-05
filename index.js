import axios from 'axios'
import { sign } from './libs/sign_client'
import Login from './login'
import { DEFAULT_NODE } from './const'
import style from './style'
import { hashString, insertStyle, appendMessageEl, showMessage } from './libs/common'
import { v4 as uuidv4 } from 'uuid'

export default class {
  constructor({ node, showLog = false, loginAddress, wallet } = {}) {
    this.node = node || DEFAULT_NODE

    this.wallet = wallet || 'metamask'

    // remove EVM/ prefix if exists
    if (loginAddress) {
      loginAddress = loginAddress.replace(/^EVM\//i, '')
    }
    this.login = new Login({ node: this.node, showLog, loginAddress, wallet })

    this.localstoragePrefix = `echo_${hashString(this.node)}_`

    insertStyle(style(), 'echo-login-style')
    this.$message = appendMessageEl()

    return this
  }

  getCommonHeader() {
    return {
      Authorization: `Bearer ${this.login.getToken()}`
    }
  }

  showMessage(type, text) {
    return showMessage(this.$message, type, text)
  }

  async getPosts({ target_uri, type, created_by = null } = {}) {
    if (!target_uri) {
      throw new Error('TARGET_URI IS REQUIRED')
    }

    try {
      const rs = await axios.get(`${this.node}/api/v1/posts`, {
        params: {
          target_uri,
          type,
          created_by
        }
      })
      return rs.data
    } catch (e) {
      if (e.response && e.response.data && e.response.data.msg) {
        throw new Error(e.response.data.msg)
      } else {
        throw e
      }
    }
  }

  async post(data) {
    if (!this.login.hasLogined) {
      try {
        const rs = await this.login.login()
        if (!rs) {
          return
        }
      } catch (e) {
        throw e
      }
    }

    const body = {
      protocol_version: '0.1',
      ...data,
      id: uuidv4()
    }

    const signed = sign(body, this.localstoragePrefix)

    body.public_key = signed.publicKey
    body.signature = signed.signature

    try {
      const rs = await axios.post(`${this.node}/api/v1/posts`, body, {
        headers: this.getCommonHeader()
      })
      return rs.data
    } catch (e) {
      if (e.response && e.response.data && e.response.data.msg) {
        throw new Error(e.response.data.msg)
      } else {
        throw e
      }
    }
  }
}
