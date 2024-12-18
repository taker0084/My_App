
# from tkinter import NO

# from flask import redirect, url_for
from flaskr.db import get_db
from werkzeug.security import generate_password_hash # type: ignore
from pydantic import BaseModel # type: ignore

class User(BaseModel):
  username:str
  password: str
  id:int = None
    
  def register(self):
    error = None
    db=get_db()
    try:
      db.execute(
        "INSERT INTO user (username, password) VALUES (?, ?)",   #プレースホルダーによるSQLインジェクション対策
        (self.username, generate_password_hash(self.password)),   #パスワードのハッシュ化を行ってから保存
      )
      db.commit()
    except db.IntegrityError:
      error = f" ユーザー名：{self.username}は登録されています ."       #usernameは一意であるため、登録済みの場合エラーを表示
    return error
  
  @classmethod
  def get_by_name(cls,username):
    db=get_db()
    data = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)             #dbからusernameが一致する行を取得
    ).fetchone()
    if data is None:
      return None
    else: return User(username=data["username"],password=data["password"], id=data["id"])
  
  @classmethod
  def get_by_id(cls,user_id):
    db=get_db()
    data = db.execute(                             
      'SELECT * FROM user WHERE id = ?', (user_id,)                   #dbからidの一致する行を取得
    ).fetchone()
    return User(username=data["username"],password=data["password"], id=data["id"])