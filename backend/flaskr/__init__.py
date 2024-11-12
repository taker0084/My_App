from datetime import timedelta
import os

from flask import Flask
from instance.config import SECRET_KEY 
from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app,origins=["http://localhost:3000"],supports_credentials=True)
    app.config.from_mapping(  # 標準設定を行う
        SECRET_KEY=SECRET_KEY,  # データの安全性を保つために行う　→　本来は無作為な値で更新
        DATABASE=os.path.join(
            app.instance_path, "flaskr.sqlite"
        ),  # データベースへのパス、instance_pathはFlaskのインスタンスが存在
        
        # PERMANENT_SESSION_LIFETIME=timedelta(days=1),
        # # @flask_login.login_requiredのhttp通信を拒否する
        # SESSION_COOKIE_SECURE=True,
        # # JavaScriptがCookieへアクセスできなくする
        # SESSION_COOKIE_HTTPONLY=True,
        # # クロスドメインのバックエンド⇨クライアントでSet-Cookieを返す
        # # Secure属性を付けないとNoneにできない
        # SESSION_COOKIE_SAMESITE="None",
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello/')
    def hello():
        return 'Hello, World!'
    
    from . import db
    db.init_app(app)

    from . import auth

    app.register_blueprint(auth.bp)

    # blog機能
    # from . import friend
    # app.register_blueprint(.bp)
    # app.add_url_rule("/", endpoint="index")  # blog.indexもindexも、両方同じURL'/'を参照する
    
    return app