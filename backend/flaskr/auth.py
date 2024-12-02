import functools

from flask import ( # type: ignore
    Blueprint, redirect, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash # type: ignore
from flaskr.db import get_db
from flaskr.models.user import User

#Blueprintはviewやコードをまとめる方法、今回は`auth`というグループを作成する
#`auth`グループ内の関数では全て前に/authがつく
bp = Blueprint('auth', __name__)

#サインアップ画面のview関数
@bp.route('/users', methods=['POST'])
def register():
    json = request.get_json()
    username = json['username']
    password = json['password']
    confirmpassword = json['ConfirmPassword']
    db = get_db()
    error = None
    user = User(username=username,password=password)
    error = user.register()
    if error is None:
        return jsonify({"message": "Signup success"}),200
    return jsonify({"message": error})                                                  #エラーをセッションに保存し、レンダリングされた時にエラーをhtmlに組み込む


#ログイン画面のURL
@bp.route('/session', methods=['GET','POST','DELETE'])
def login():
    if request.method == 'GET':
        if 'user_id' in session:
            user = User.get_by_id(session['user_id'])
            return jsonify({"username": user.username,"user_id":user.id})
        else:
            return jsonify({"username": ""})
    elif request.method == 'DELETE':
        session.clear()
        return jsonify({"message": "Logout success"}),200
    else:
        json = request.get_json()
        username = json['username']
        password = json['password']
        user = User.get_by_name(username)
        error = None
        if user is None:
            error = 'ユーザー名が登録されていません.'
        elif not check_password_hash(user.password, password):#入力されたパスワードのハッシュ値と、保存したハッシュ値を比較
            error = 'パスワードが異なります.'

        if error is None:
            session.clear()                                                  #ログインが成功した場合、セッションを初期化 → セッションはリクエストを跨いで格納されるデータのdict
            session['user_id'] = user.id                                     #セッションにユーザーIDを登録
            response = jsonify({"message": "Login success","user_id":session['user_id']}),200           #初期画面に遷移
            #response.set_cookie('session_id', 'your_session_cookie_value', httponly=True)
            return response
        # エラー時のレスポンス
        return jsonify({"message": error})
#全てのview関数の前にuserがログイン済みかを確認
# @bp.before_app_request
# def load_logged_in_user():
#     user_id = session.get('user_id')
#     error = None

# def login_required(view):
#     @functools.wraps(view)                                            #元のview関数の処理を行う前に処理を行う
#     def wrapped_view(**kwargs):
#         if session['user_id'] is None:
#             return redirect(url_for('auth.login'))          #ログインしていない場合は自動的にログイン画面に遷移

#         return view(**kwargs)                                                 #ログインしていれば元のview関数を実行

#     return wrapped_view
