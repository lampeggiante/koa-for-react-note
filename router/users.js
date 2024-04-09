import Router from "koa-router"

import { pool } from "../core/db"

const userRouter = new Router()

userRouter.post("/test", async (ctx) => {
  ctx.body = ctx.request.body
})

// 新增用户
userRouter.post("/add_new_user", async (ctx) => {
  const { username, password, email } = ctx.request.body

  try {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
    )
    console.log(result)
    ctx.body = {
      message: "User Registered Successfully.",
      code: 200,
    }
    ctx.status = 200
  } catch (err) {
    ctx.status = 500
    ctx.body = "Internal Server Error"
    console.log(err)
  }
})

// 用户登录
userRouter.post("/user_login", async (ctx) => {
  console.log("1")
  const { username, password } = ctx.request.body
  console.log("2")
  try {
    const [result] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
    )
    // console.log(result)
    ctx.status = 200
    if (password === result[0].password) {
      ctx.body = {
        data: result[0],
        message: "Logining Successfully.",
        code: 200,
      }
    } else {
      ctx.body = {
        message: "username or password incorrect.",
        code: 200,
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = "Internal Server Error"
    console.log(err)
  }
})

userRouter.post("/update_user_info", async (ctx) => {
  const { user_id, username, email, password } = ctx.request.body

  try {
    const [result] = await pool.execute(
      "UPDATE users SET username =  ?, email = ?, password = ? WHERE user_id = ?",
      [username, email, password, user_id],
    )

    // 加入逻辑判断信息是否未修改

    if (result.affectedRows === 0) {
      ctx.throw(404, "User not found")
    } else {
      ctx.body = {
        user_id,
        message: "User Info updated successfully",
        code: 200,
      }
      ctx.status = 200
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = "Internal Server Error"
    console.log(err)
  }
})

// 获得所有用户信息
userRouter.get('/all_users', async (ctx) => {
  const [results, fields] = await pool.query("SELECT * FROM users")
  console.log(results, fields)
  ctx.status = 200
  ctx.body = {
    data: results,
    message: 200,
    data: results
  }
})

export default userRouter
