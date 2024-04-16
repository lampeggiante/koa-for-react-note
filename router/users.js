import Router from "koa-router"
import jwt from "jsonwebtoken"
import Base64 from "js-base64"
import product_intro from "../public/product_intro"

import { pool } from "../core/db"

const userRouter = new Router()

/* userRouter.post("/test", async (ctx) => {
  ctx.body = ctx.request.body
}) */

// 新增用户
userRouter.post("/add_new_user", async (ctx) => {
  const { username, password, email } = ctx.request.body
  const actual_password = Base64.decode(password)

  try {
    const [result, fields] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, actual_password],
    )
    console.log(result)

    pool.execute(
      "INSERT INTO notes (user_id, noteTitle, noteContent, isStar, isTrash) VALUES (?, ?, ?, ?, ?)",
      [result.insertId, '项目介绍', product_intro.noteContent1, 0, 0],
    )
    pool.execute(
      "INSERT INTO notes (user_id, noteTitle, noteContent, isStar, isTrash) VALUES (?, ?, ?, ?, ?)",
      [result.insertId, 'demo', product_intro.noteContent2, 0, 0],
    )

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
  const { username, password } = ctx.request.body
  const actual_password = Base64.decode(password)
  try {
    if (!actual_password || !username) {
      ctx.body = {
        message: "表单不全",
        code: 200,
      }
      return
    }
    const [result] = await pool.execute(
      "SELECT user_id, password FROM users WHERE username = ?",
      [username],
    )
    // console.log(result)
    ctx.status = 200
    if (result[0] && actual_password === result[0].password) {
      const token = jwt.sign(username, 'koa-for-react-note')
      ctx.body = {
        data: {
          token,
          user_id: result[0].user_id,
        },
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

// 修改信息、密码
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

userRouter.post("/update_latest_note", async (ctx) => {
  const { user_id, latestNoteId } = ctx.request.body
  try {
    const [result] = await pool.execute(
      "UPDATE users SET latestNoteId = ? WHERE user_id = ?",
      [latestNoteId, user_id],
    )
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
