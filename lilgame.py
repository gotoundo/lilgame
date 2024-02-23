import os
import random
from pynput.keyboard import Key, Listener

# Settings
grid_size = 10
player_pos = [grid_size // 2, grid_size // 2]
enemies = [[random.randint(0, grid_size - 1), random.randint(0, grid_size - 1)] for _ in range(5)]
score = 0

# Function to print the grid
def print_grid():
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the console window
    print(f"Score: {score}")
    for y in range(grid_size):
        row = ''
        for x in range(grid_size):
            if [x, y] == player_pos:
                row += 'P '  # Player position
            elif [x, y] in enemies:
                row += 'E '  # Enemy position
            else:
                row += '. '  # Empty space
        print(row)
    print("Use arrow keys to move. Press space to destroy nearby enemies. Press 'q' to quit.")

# Function to move the player
def move_player(key):
    global player_pos, score
    if key == Key.up and player_pos[1] > 0:
        player_pos[1] -= 1
    elif key == Key.down and player_pos[1] < grid_size - 1:
        player_pos[1] += 1
    elif key == Key.left and player_pos[0] > 0:
        player_pos[0] -= 1
    elif key == Key.right and player_pos[0] < grid_size - 1:
        player_pos[0] += 1
    elif key == Key.space:  # Destroy nearby enemies
        radial_blast()
        
#Remove nearby players
def radial_blast():
    global player_pos, score                
    to_remove = []
    for enemy in enemies:
        if abs(enemy[0] - player_pos[0]) <= 1 and abs(enemy[1] - player_pos[1]) <= 1:
            to_remove.append(enemy)
            score += 1
    for enemy in to_remove:
        enemies.remove(enemy)

# Function to move the enemies towards the player
def move_enemies():
    for i, enemy in enumerate(enemies):
        # Potential new positions
        new_positions = []

        # Check potential movement in each direction
        if enemy[0] < player_pos[0]:
            new_positions.append([enemy[0] + 1, enemy[1]])
        elif enemy[0] > player_pos[0]:
            new_positions.append([enemy[0] - 1, enemy[1]])

        if enemy[1] < player_pos[1]:
            new_positions.append([enemy[0], enemy[1] + 1])
        elif enemy[1] > player_pos[1]:
            new_positions.append([enemy[0], enemy[1] - 1])

        # Filter out positions that are occupied by other enemies
        valid_positions = [pos for pos in new_positions if pos not in enemies]

        # Move enemy to the new position if valid, otherwise stay in place
        if valid_positions:
            # Prioritize moving closer on the axis with the greatest distance
            if abs(enemy[0] - player_pos[0]) > abs(enemy[1] - player_pos[1]):
                # Try to move in x-direction
                preferred_moves = [pos for pos in valid_positions if pos[0] != enemy[0]]
            else:
                # Try to move in y-direction
                preferred_moves = [pos for pos in valid_positions if pos[1] != enemy[1]]

            # If there are preferred moves available, choose one, otherwise, choose any valid move
            if preferred_moves:
                enemies[i] = random.choice(preferred_moves)
            else:
                enemies[i] = random.choice(valid_positions)


# Keyboard event handlers
def on_press(key):
    if key == Key.esc or (hasattr(key, 'char') and key.char == 'q'):  # Quit game
        return False  # Stop listener
    move_player(key)
    move_enemies()
    add_enemy() 
    #if key == Key.space:  # Destroy nearby enemies a second time this frame
    #    radial_blast()
    print_grid()

def on_release(key):
    pass  # We don't need to use this in our game

def add_enemy():
    new_enemy = [random.randint(0, grid_size - 1), random.randint(0, grid_size - 1)]
    enemies.append(new_enemy)

# Start the game
print_grid()
with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()