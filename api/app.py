from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains (for development purposes)

lobbies = {}  # Dictionary to store lobby information
lobby_players = {}  # Dictionary to store players in each lobby
LOBBY_LIMIT = 4  # Maximum number of players per lobby


def find_or_create_lobby(player_name, selected_type, selected_category, selected_search_option, selected_custom_game_option):
    # Assign a unique ID to the player
    player_id = str(uuid.uuid4())
    player_info = {'id': player_id, 'name': player_name}

    # Try to find an existing lobby that matches the criteria
    for lobby_id, lobby in lobbies.items():
        if (lobby['selectedType'] == selected_type and
            lobby['selectedCategory'] == selected_category and
            lobby['selectedSearchOption'] == selected_search_option and
            len(lobby_players[lobby_id]) < LOBBY_LIMIT):
            # A suitable lobby is found, add the player to it
            lobby_players[lobby_id].append(player_info)
            return lobby_id, 'Lobiye katıldınız', lobby_players[lobby_id]
    
    # No suitable lobby found, create a new lobby
    lobby_id = str(uuid.uuid4())
    lobbies[lobby_id] = {
        'id': lobby_id,
        'selectedType': selected_type,
        'selectedCategory': selected_category,
        'selectedSearchOption': selected_search_option,
        'selectedCustomGameOption': selected_custom_game_option,
        'players': []
    }
    
    # Add the player to the new lobby
    lobbies[lobby_id]['players'].append(player_info)
    lobby_players[lobby_id] = [player_info]
    

    return lobby_id, 'Lobi oluşturuldu', lobbies[lobby_id]


@app.route('/create-lobby', methods=['POST'])
def create_lobby():
    data = request.get_json()
    
    player_name = data.get('playerName')
    selected_type = data.get('selectedType')
    selected_category = data.get('selectedCategory')
    selected_search_option = data.get('selectedSearchOption')
    selected_custom_game_option = data.get('selectedCustomGameOption')

    # Validate the input
    if not player_name or not selected_type or not selected_category or not selected_search_option:
        return jsonify({'message': 'Eksik bilgi', 'status': 'error'}), 400

    # Create or find the lobby
    lobby_id, status_message, players_in_lobby = find_or_create_lobby(
        player_name,
        selected_type,
        selected_category,
        selected_search_option,
        selected_custom_game_option
    )

    return jsonify({
        'status': status_message,
        'lobbyId': lobby_id,
        'players': players_in_lobby
    }), 200

@app.route('/get-lobbies', methods=['GET'])
def get_lobbies():
    player_id = request.args.get('playerId')
    if not player_id:
        return jsonify({'message': 'Oyuncu ID gerekli', 'status': 'error'}), 400
    
    # Lobbies sözlüğünü bir string olarak yazdırın
    print("lobbies = ", lobbies)

    player_lobbies = []
    
    # Tüm lobiler üzerinde döngü
    for lobby_id, lobby_info in lobbies.items():
        # Mevcut lobi için oyuncuları al
        players_in_lobby = lobby_players.get(lobby_id, [])
        
        # Listeyi stringe dönüştürerek yazdır
        print("lobideki kişilerrrrrrrr : \n" + str(players_in_lobby))
        
        # Oyuncu ID'si bu lobide mi kontrol et
        if any(player['id'] == player_id for player in players_in_lobby):
            player_names = [player['name'] for player in players_in_lobby]
            player_lobbies.append({
                'id': lobby_id,
                'players': player_names,
                'status': 'Lobiye katıldınız',
                **lobby_info
            })
    # Oyuncuların isimlerini almak için list comprehension kullanın
    player_names = [player['name'] for player in players_in_lobby]
    return jsonify(lobby_id,player_names), 200



if __name__ == '__main__':
    app.run(debug=True)