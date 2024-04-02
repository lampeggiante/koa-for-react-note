export default {
  ip: "127.0.0.1",
  port: "3000",
  staticPath: "/public",
}

export const SESSION_CONFIG = {
  key: "koa-for-react-note", // 设置cookie的key的名字
  maxAge: 1000 * 60 * 60 * 1, // 设置有效期为一个小时
  httpOnly: true, // 仅服务端修改
  signed: true, // 签名cookie
}
