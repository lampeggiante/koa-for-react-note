export class CustomException extends Error {
  constructor(code = 400,msg = "服务器异常") {
    super();
    this.status = code;
    this.message = msg;
    this.stack = '自定义异常'
  }
}
