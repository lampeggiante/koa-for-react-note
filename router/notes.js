import Router from "koa-router"

import { pool } from "../core/db"

const notesRouter = new Router()

notesRouter.post("/test", async (ctx) => {
  ctx.body = ctx.request.body
})

notesRouter.get("/get_all_notes", async (ctx) => {
  const [results, fields] = await pool.query("SELECT * FROM notes")
  console.log(results, fields)
  ctx.status = 200
  ctx.body = {
    message: 200,
    data: results
  }
})

notesRouter.post("/add_new_note", async (ctx) => {
  const { noteId, noteTitle, noteContent, isStar, isTrash } = ctx.request.body

  try {
    const [result] = await pool.execute(
      "INSERT INTO notes (noteId, noteTitle, noteContent, isStar, isTrash) VALUES (?, ?, ?, ?, ?)",
      [noteId, noteTitle, noteContent, isStar, isTrash],
    )
    console.log(result)
    ctx.body = {
      message: "Note Created Successfully.",
    }
    ctx.status = 200
  } catch (err) {
    ctx.status = 500
    ctx.body = "Internal Server Error"
    console.error(err)
  }
})

notesRouter.post("/update_note", async (ctx) => {
  const { noteId, noteTitle, noteContent, isStar, isTrash } = ctx.request.body
  
  try {
    const [result] = await pool.execute("UPDATE notes SET noteTitle = ?, noteContent = ?, isStar = ?, isTrash = ? WHERE noteId = ?", [noteTitle, noteContent, isStar, isTrash, noteId])
    if (result.affectedRows === 0) {
      ctx.throw(404, 'Note not found');
    } else {
      ctx.body = { noteId, message: 'Note updated successfully', code: 200 };
      ctx.status = 200;
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
    console.error(err);
  }
})

notesRouter.post('/delete_note', async (ctx) => {
  const { noteId } = ctx.request.body

  try {
    const [result] = await pool.execute(
      'DELETE FROM notes WHERE noteId = ?',
      [noteId]
    );
    if (result.affectedRows === 0) {
      ctx.throw(404, 'Note not found');
    } else {
      ctx.body = { message: 'Note deleted successfully', noteId };
      ctx.status = 200;
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
    console.error(error);
  }
})

export default notesRouter
