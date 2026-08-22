const SESSION_KEY = 'authSession'
let pendingWechatLogin = null

function saveWechatSession(extra = {}) {
  const current = uni.getStorageSync(SESSION_KEY) || {}
  const isWechatSession = current.loginType === 'wechat'
  const session = {
    loggedIn: true,
    accountId: (isWechatSession && current.accountId) || 'wechat:pending-server-exchange',
    name: (isWechatSession && current.name) || '微信用户',
    avatar: (isWechatSession && current.avatar) || '',
    avatarText: (isWechatSession && current.avatarText) || '微',
    phone: '',
    loginType: 'wechat',
    loginAt: Date.now(),
    ...extra
  }
  uni.setStorageSync(SESSION_KEY, session)
  return session
}

export function getWechatSession() {
  const session = uni.getStorageSync(SESSION_KEY) || {}
  return session.loggedIn && session.loginType === 'wechat' ? session : null
}

export function loginWithWechat() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: ({ code }) => {
        if (!code) {
          reject(new Error('微信未返回登录凭证'))
          return
        }

        // TODO: 服务端接口就绪后，将 code 发送给服务端换取业务 token、openid 对应的用户资料，
        // 再用服务端返回的数据覆盖下面的开发态会话。登录 code 不应保存到本地。
        resolve(saveWechatSession({ needsServerExchange: true }))
      },
      fail: reject
    })
    // #endif

    // #ifndef MP-WEIXIN
    // 浏览器开发环境无法调用微信小程序登录，使用同结构会话便于页面联调。
    resolve(saveWechatSession({ needsServerExchange: true }))
    // #endif
  })
}

export function ensureWechatSession() {
  const session = getWechatSession()
  if (session) return Promise.resolve(session)
  if (!pendingWechatLogin) {
    pendingWechatLogin = loginWithWechat().finally(() => {
      pendingWechatLogin = null
    })
  }
  return pendingWechatLogin
}
