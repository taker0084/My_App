from instance.config import GOOGLE_API_KEY
from flaskr.models.Friend import Friend
from flask import Blueprint, jsonify, request,session
import google.generativeai as genai

bp = Blueprint('Action', __name__)

@bp.route('/friends', methods=['POST','GET'])
def friends():
    if request.method == 'GET':
        error = None
        print(session.get('user_id'))
        friends = Friend.GetAll(user_id=session.get('user_id'))
        #friends = Friend.GetAll(user_id=1)
        if friends is None:
            return jsonify({"message": "No friends found", "friends": []}), 200
        
        # Friendインスタンスを辞書に変換してJSONで返す
        friends_list = [
            {"friend_id": friend.id, "name": friend.name,"birthday":friend.birthday}
            for friend in friends
        ]
        
        return jsonify({"status": "Success", "friends": friends_list}), 200

    json = request.get_json()
    register_id = json['userId']
    friendName = json['friendName']
    Birthday = json['friendBirthday']
    age = json['Age']
    hobby = json['hobby']
    error = None
    friend = Friend(name=friendName,birthday=Birthday,age=age,hobby=hobby)
    error = friend.register(register_id=register_id)
    if error is not None:
        return jsonify({"message": error})
    
    return jsonify({"message": "Register success"}),200

@bp.route('/friends/<string:id>', methods=['GET','PATCH','DELETE'])
def friend(id):
    friend_id = int(id)
    friend = Friend.get_by_id(id=friend_id)
    if friend is None:
        return jsonify({"message": "No friend found"}), 200
      
    if request.method == 'GET':
        # Friendインスタンスを辞書に変換してJSONで返す
        friend_dict = {
            "name": friend.name,
            "birthday": friend.birthday,
            "age": friend.age,
            "hobby": friend.hobby,
            "gift": friend.gift
        }
        return jsonify({"status": "Success", "friend": friend_dict}), 200

    elif request.method == 'PATCH':
        json = request.get_json()
        friendName = json['friendName']
        Birthday = json['birthday']
        age = json['age']
        hobby = json['hobby']
        gift=json['gift']
        error = None
        error = friend.Update(name=friendName, birthday=Birthday, age=age,hobby=hobby,gift=gift)
        if error is not None:
            return jsonify({"status": error})

        return jsonify({"status": "Update success"}),200
    
    else:
        error = None
        error = friend.delete()
        if error is not None:
            return jsonify({"message": error})

        return jsonify({"message": "Delete success"}),200

@bp.route('/friends/<string:id>/gift', methods=['GET'])
def gift(id):
    friend_id = int(id)
    friend = Friend.get_by_id(id=friend_id)
    if friend is None:
        return jsonify({"message": "No friend found"}), 200

    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    if friend.hobby is "":
        hobby = ""
        question = f"${friend.age}歳の趣味を一つランダムに挙げてください、ただし単語で答えてください、また毎回同じ出力を出さないようにしてください、最後に改行を入れないでください"
        response = model.generate_content(question)
        hobby = response.text
    else:
        hobby = friend.hobby
    model = genai.GenerativeModel("gemini-pro")
    question = f"${friend.age}歳の人へのプレゼントを一つランダムに挙げてください、ただし単語で答えてください、趣味は${hobby}です、また毎回同じ出力を出さないようにしてください"
    response = model.generate_content(question)
    return jsonify({"hobby":hobby,"gift": response.text}),200