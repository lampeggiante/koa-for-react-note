import path from 'path'
import log4js from 'koa-log4';

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile', // 日志输出的类型
      pattern: '-yyyy-MM-dd.log', //当type为dateFile时，指定文件名的日期格式
      // 文件名后面加后缀
      alwaysIncludePattern:true,
      daysToKeep: 7, // 日志保留的天数
      compress:true, // 是否压缩
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m', // 输出日志的格式
      },
      filename: path.join(path.resolve(), 'logs/access') //生成文件名
    },
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern:true,
      daysToKeep: 7, 
      compress:true, // 是否压缩
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m', // 输出日志的格式
      },
      filename:path.join(path.resolve(), 'logs/application')
    },
    server: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern:true,
      daysToKeep: 7, 
      compress:true, // 是否压缩
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m', // 输出日志的格式
      },
      filename:path.join(path.resolve(), 'logs/server')
    }
  },
  categories: {
    default: { appenders: [ 'access' ], level: 'info' },
    access: { appenders: [ 'access' ], level: 'info' },
    application: { appenders: [ 'application' ], level: 'WARN'},
    server: { appenders: [ 'server' ], level: 'error'}
  }
});
export const accessLogger =  () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
export const logger= log4js.getLogger('application');  //记录所有应用级别的日志
export const serverLogger= log4js.getLogger('server');  //记录服务错误日志
