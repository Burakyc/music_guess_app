from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import csv
import os

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains (for development purposes)

lobbies = {}  # Dictionary to store lobby information
lobby_players = {}  # Dictionary to store players in each lobby
LOBBY_LIMIT = 4  # Maximum number of players per lobby
CSV_FILE = 'lobbies.csv'  # CSV file name


# Function to write lobby data to CSV
def write_to_csv(lobby_id, player_info, game_type):
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['Lobby ID', 'Player ID', 'Player Name', 'ready', 'oyuntürü'])  # Add 'oyuntürü' in the header
        writer.writerow([lobby_id, player_info['id'], player_info['name'], player_info.get('ready', 'not ready'), game_type])  # Include 'oyuntürü' in the row

def find_or_create_lobby(player_name, selected_type, selected_category, selected_search_option, selected_custom_game_option):
    # Assign a unique ID to the player
    player_id = str(uuid.uuid4())
    player_info = {'id': player_id, 'name': player_name, 'ready': 'not ready'}  # Default to 'not ready'
    game_type = selected_category  # Assuming 'oyuntürü' corresponds to 'selectedCategory'

    # Try to find an existing lobby that matches the criteria
    for lobby_id, lobby in lobbies.items():
        if (lobby['selectedType'] == selected_type and
            lobby['selectedCategory'] == selected_category and
            lobby['selectedSearchOption'] == selected_search_option and
            len(lobby_players[lobby_id]) < LOBBY_LIMIT):
            # A suitable lobby is found, add the player to it
            lobby_players[lobby_id].append(player_info)
            write_to_csv(lobby_id, player_info, game_type)  # Write to CSV with game type
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
    write_to_csv(lobby_id, player_info, game_type)  # Write to CSV with game type

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
    lobby_id = request.args.get('playerId')
    if not lobby_id:
        return jsonify({'message': 'Lobi ID gerekli', 'status': 'error'}), 400
    
    print(f"Received request for Lobby ID: {lobby_id}")

    player_lobbies = []

    try:
        with open(CSV_FILE, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Lobby ID'].strip() == lobby_id.strip():  # Match the lobby ID
                    player_lobbies.append({
                        'id': row['Player ID'].strip(),
                        'name': row['Player Name'].strip(),
                        'ready': row['ready'].strip()  # Include the ready status
                    })
    except UnicodeDecodeError:
        print(f"Error decoding the CSV file with utf-8 encoding. Trying with a different encoding.")
        try:
            with open(CSV_FILE, mode='r', encoding='latin1') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['Lobby ID'].strip() == lobby_id.strip():  # Match the lobby ID
                        player_lobbies.append({
                            'id': row['Player ID'].strip(),
                            'name': row['Player Name'].strip(),
                            'ready': row['ready'].strip()  # Include the ready status
                        })
        except Exception as e:
            print(f"Error reading CSV file: {e}")
            return jsonify({'message': 'CSV dosyası okunamadı', 'status': 'error'}), 500
    
    if not player_lobbies:
        print(f"Lobby ID {lobby_id} not found in CSV.")
        return jsonify({'message': 'Bu lobiye ait oyuncu bulunamadı', 'status': 'error'}), 404

    print(f"Lobi ID: {lobby_id}, Oyuncular: {player_lobbies}")
    
    return jsonify({
        'lobbyId': lobby_id,
        'players': player_lobbies,
        'status': 'Lobiye katıldınız'
    }), 200
@app.route('/update-ready-status', methods=['POST'])
def update_ready_status():
    data = request.get_json()
    
    lobby_id = data.get('playerId')
    ready_status = data.get('ready')

    if not lobby_id or ready_status is None:
        return jsonify({'message': 'Lobi ID ve Ready durumu gerekli', 'status': 'error'}), 400

    updated = False
    rows = []
    
    # Read the CSV and update the relevant player's ready status in the specified lobby
    try:
        with open(CSV_FILE, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Lobby ID'].strip() == lobby_id.strip():
                    row['ready'] = ready_status
                    updated = True
                rows.append(row)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return jsonify({'message': 'CSV dosyası okunamadı', 'status': 'error'}), 500

    if not updated:
        return jsonify({'message': 'Lobi bulunamadı veya lobiye ait oyuncular bulunamadı', 'status': 'error'}), 404

    # Write the updated data back to the CSV
    try:
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['Lobby ID', 'Player ID', 'Player Name', 'ready','oyuntürü'])
            writer.writeheader()
            writer.writerows(rows)
    except Exception as e:
        print(f"Error writing to CSV file: {e}")
        return jsonify({'message': 'CSV dosyasına yazılamadı', 'status': 'error'}), 500

    return jsonify({'message': 'Ready durumu güncellendi', 'status': 'success'}), 200


if __name__ == '__main__':
    app.run(debug=True)
