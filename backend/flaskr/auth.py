from ast import IsNot
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db
from flaskr.models.user import User

#Blueprintはviewやコードをまとめる方法、今回は`auth`というグループを作成する
#`auth`グループ内の関数では全て前に/authがつく
bp = Blueprint('auth', __name__, url_prefix='/auth')

#サインアップ画面のview関数
@bp.route('/register/', methods=['POST'])
def register():
    json = request.get_json()
    username = json['username']
    password = json['password']
    confirmpassword = json['ConfirmPassword']
    db = get_db()
    error = None

    if not username:
        error = 'Username is required.'
    elif not password:
        error = 'Password is required.'
        
    if password != confirmpassword:
        error = 'Password and Confirm Password are not same.'

    if error is None:
        user = User(username=username,password=password)
        error = user.register()
            # try:
            #     db.execute(
            #         "INSERT INTO user (username, password) VALUES (?, ?)",   #プレースホルダーによるSQLインジェクション対策
            #         (username, generate_password_hash(password)),   #パスワードのハッシュ化を行ってから保存
            #     )
            #     db.commit()
            # except db.IntegrityError:
            #     error = f"User {username} is already registered."       #usernameは一意であるため、登録済みの場合エラーを表示
            # else:
            #     return redirect(url_for("auth.login"))     #データを保存したらログイン画面に遷移,url_forは関数名からURLを生成
        if error is None:
            return jsonify({"message": "Signup success"}),200

    return jsonify({"message": error})                                                  #エラーをセッションに保存し、レンダリングされた時にエラーをhtmlに組み込む


#ログイン画面のURL
@bp.route('/login/', methods=['POST'])
def login():
  json = request.get_json()
  username = json['username']
  password = json['password']
  user = User.get_by_name(username)
  error = None
        # db = get_db()
        # user = db.execute(
        #     'SELECT * FROM user WHERE username = ?', (username,)             #dbからusernameが一致する行を取得
        # ).fetchone()                                                         #クエリから一行のみ返す(特定のuserの情報は一行のみ)

  if user is None:
      error = 'Incorrect username.'
  elif not check_password_hash(user.password, password):#入力されたパスワードのハッシュ値と、保存したハッシュ値を比較
      error = 'Incorrect password.'

  if error is None:
      session.clear()                                                  #ログインが成功した場合、セッションを初期化 → セッションはリクエストを跨いで格納されるデータのdict
      session['user_id'] = user.id                                     #セッションにユーザーIDを登録
      response = jsonify({"message": "Login success","user_id":session['user_id']}),200           #初期画面に遷移
      #response.set_cookie('session_id', 'your_session_cookie_value', httponly=True)
      return response

    # エラー時のレスポンス

  return jsonify({"message": error})

@bp.route('/check/',methods=['GET'])
def check():
  # return jsonify({"username": "a"}),200
  if 'user_id' in session:
    user = User.get_by_id(session['user_id'])
    return jsonify({"username": user.username})
  else:
    return jsonify({"username": ""})

#全てのview関数の前にuserがログイン済みかを確認
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    error = None

    # if user_id is None:
    #     g.user = None
    # else:                                                                     #ログイン済みの場合、user情報をリクエストに付与
    #     g.user = User.get_by_id(user_id)
    #     # g.user = get_db().execute(                             
    #     #     'SELECT * FROM user WHERE id = ?', (user_id,)
    #     # ).fetchone()

#ログアウト処理       
@bp.route('/logout/')
def logout():
    session.clear()                                                           #セッションを初期化し、ログイン情報を削除
    return jsonify({"message": "Logout success"}),200


def login_required(view):
    @functools.wraps(view)                                            #元のview関数の処理を行う前に処理を行う
    def wrapped_view(**kwargs):
        if session['user_id'] is None:
            return redirect(url_for('auth.login'))          #ログインしていない場合は自動的にログイン画面に遷移

        return view(**kwargs)                                                 #ログインしていれば元のview関数を実行

    return wrapped_view
