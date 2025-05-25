import random

def next_move(state):
    ball_x = state["ball"]["x"]
    my_x = state["you"]["x"]

    # Always try to move towards the ball
    if ball_x < my_x:
        return "left"
    elif ball_x > my_x + 1:
        return "right"
    else:
        return "stay"
