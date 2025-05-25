import random

def next_move(state):
    ball_x = state["ball"]["x"]
    ball_y = state["ball"]["y"]
    my_x = state["you"]["x"]
    my_y = state["you"]["y"]
    opponent_x = state["opponent"]["x"]
    opponent_y = state["opponent"]["y"]

    # Bot strategy: Move towards the ball and avoid the opponent if they are close
    move = "stay"

    # First, check if the ball is directly in front of us
    if ball_x < my_x:
        move = "left"
    elif ball_x > my_x:
        move = "right"

    # If the ball is nearby, try to position vertically as well
    if ball_y < my_y:
        move = "up"
    elif ball_y > my_y:
        move = "down"

    # Avoid opponent if they're too close to the ball
    if abs(opponent_x - ball_x) < 2 and abs(opponent_y - ball_y) < 2:
        # If opponent is too close, avoid them by moving in a safe direction
        if opponent_x < my_x:
            move = "right"  # Move right to avoid opponent on the left
        elif opponent_x > my_x:
            move = "left"  # Move left to avoid opponent on the right

    # Randomize move in case of ties or when no immediate action is needed
    if random.random() < 0.2:
        move = random.choice(["left", "right", "up", "down", "stay"])

    return move
