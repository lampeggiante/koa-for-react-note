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

export const DATABASE_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "yxl20020214",
}

export const NOTESLIST_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "yxl20020214",
  database: 'REACT_NOTES',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}
