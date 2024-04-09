import mysql from "mysql2/promise"
import { DATABASE_CONFIG, NOTESLIST_CONFIG } from "../config"

export default async () => {
  const connection = await mysql.createConnection(DATABASE_CONFIG)

  await connection.query(
    "CREATE DATABASE IF NOT EXISTS REACT_NOTES CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;",
  )
  // console.log('创建数据库REACT_NOTE成功')
  await connection.query("use REACT_NOTES;")
  // console.log('进入数据库REACT_NOTE')
  await connection.query(
    `CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(40),
      password VARCHAR(18) NOT NULL
    );`
  )
  await connection.query("ALTER TABLE users AUTO_INCREMENT = 10000;")
  // console.log('创建用户表成功')
  await connection.query(
    `CREATE TABLE IF NOT EXISTS notes (
      noteId BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      noteTitle VARCHAR(30) NOT NULL,
      noteContent LONGTEXT,
      isStar TINYINT(1) DEFAULT 0,
      isTrash TINYINT(1) DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`
  )
  await connection.query("ALTER TABLE notes AUTO_INCREMENT = 100000;")
  // console.log('创建笔记表成功')

  // connection.end()
}

export const pool = mysql.createPool(NOTESLIST_CONFIG)
