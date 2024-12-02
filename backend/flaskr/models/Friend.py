import datetime
from flaskr.db import get_db
from pydantic import BaseModel # type: ignore


class Friend(BaseModel):
    id: int=None
    name: str
    birthday: datetime.date
    age: int
    hobby: str
    gift: str = ""
    
    def register(self,register_id):
      error = None
      db=get_db()
      try:
        db.execute(
          "INSERT INTO friend (friendname, birthday,age,hobby,register_id) VALUES (?, ?, ?, ?,?)",   #プレースホルダーによるSQLインジェクション対策
          (self.name,self.birthday,self.age,self.hobby,register_id),   
        )
        db.commit()
      except Exception as e:  # 例外をキャッチ
        error = str(e)  # エラーメッセージを取得
      return error
    
    def Update(self,name,age,birthday,hobby,gift):
      print(self.id)
      db=get_db()
      db.execute(
        "UPDATE friend SET friendname = ?, age= ?, birthday = ?, hobby = ?, giftname = ? WHERE id = ?",   #プレースホルダーによるSQLインジェクション対策
        (name,age,birthday,hobby,gift,self.id),
      )
      db.commit()
    
    def delete(self):
      db=get_db()
      db.execute(
        "DELETE FROM friend WHERE id = ?",   #プレースホルダーによるSQLインジェクション対策
        (self.id,)
      )
      db.commit()
     
    @classmethod
    def GetAll(cls,user_id):
      db=get_db()
      data = db.execute(
        '''
        SELECT *, 
        CASE 
            WHEN strftime('%m-%d', birthday) >= strftime('%m-%d', 'now')
            THEN 0
            ELSE 1
        END as birthday_passed,
        strftime('%m-%d', birthday) as birthday_md
        FROM friend 
        WHERE register_id = ? 
        ORDER BY birthday_passed, birthday_md
        ''', 
        (user_id,)
    ).fetchall()
      if data is None:
        return None
      friends = [
        cls(id=row["id"], name=row["friendname"], birthday=row["birthday"], age=row["age"],hobby=row["hobby"])
        for row in data
      ]
      return friends
    
    @classmethod
    def get_by_id(cls, id):
      db=get_db()
      data = db.execute(
          'SELECT * FROM friend WHERE id = ?', (id,)             #dbからusernameが一致する行を取得
      ).fetchone()
      if data["giftname"] is None:
        gift = ""
      else: gift = data["giftname"]
        
      if data is None:
        return None
      else: return Friend(id=data["id"], name=data["friendname"], birthday=data["birthday"],hobby=data["hobby"], age=data["age"],gift=gift)

    
    @classmethod
    def get_by_name(cls,friendname):
      db=get_db()
      data = db.execute(
          'SELECT * FROM friend WHERE friendname = ?', (friendname,)             #dbからfriend_idが一致する行を取得
      ).fetchone()
      if data is None:
        return None
      else: return Friend(id=data["id"], name=data["name"], birthday=data["birthday"], hobby=data["hobby"], age=data["age"])