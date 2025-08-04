from django.shortcuts import render
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response


from .models import *
from .serializer import *
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

# Create your views here.

# ---------------------------------------

# Player Views -------------------


@api_view(['POST'])
@permission_classes((AllowAny, ))
def submitAnswer(request):
    # Getting request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    # Getting data from request
    pin = body['pin']
    playername = body['playername']
    answer = body['answer']
    question_index = body['questionIndex']
    round_index = body['roundIndex']

    # Get objects from tables
    room = Room.objects.get(pin=pin)
    player = Player.objects.get(playername=playername, room_id=room)
    r = Round.objects.get(quiz_id=room.quiz_id, index=round_index)
    question = Question.objects.get(round_id=r, index=question_index)

    HostToMark.objects.create(room=room, player=player,
                              question=question, answer=answer)

    return Response({'status': 'success'})


@api_view(['POST'])
@permission_classes((AllowAny, ))
def getLeaderboard(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    pin = body['pin']
    room = Room.objects.filter(pin=pin)[0]

    players = Player.objects.filter(room_id=room).order_by('-score').values()
    p_serializer = PlayerBaseSerializer(players, many=True)

    data = {'status': 'success', 'players': p_serializer.data}
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def clientGetRound(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    round_id = body['round_id']
    pin = body['pin']

    r = Round.objects.get(id=round_id)
    room = Room.objects.get(pin=pin)

    questions = Question.objects.filter(round_id=round_id)
    q_serializer = HostQuestionSerializer(questions, many=True)
    r_serializer = RoundSerializer(r)

    data = {'round': r_serializer.data, 'questions': q_serializer.data,
            'end_time': room.round_end_time}
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def playerLeftLobby(request):
    """
    Removes a player from a lobby.

    This function is an API view that handles a POST request to remove a player from a lobby. 
    It expects a JSON payload in the request body containing the following fields:
    - pin: The pin of the room where the player is located.
    - playername: The name of the player to be removed.

    If the room with the given pin does not exist, it returns a JSON response with the status 'failed'
      and the message 'Room does not exist'. If the player with the given name does not exist in the room, 
      it returns a JSON response with the status 'failed' and the message 'Player does not exist in room'. 
      Otherwise, it deletes the player from the room and returns a JSON response with the status 'success' and the message 'Player left room'.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - JsonResponse: A JSON response indicating the status and message of the operation.

    Permissions:
    - AllowAny: This view allows any user to access it.

    """
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    room_id = Room.objects.filter(pin=body['pin'])
    if not room_id.exists():
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    player_id = Player.objects.filter(
        playername=body['playername'], room_id=room_id[0])
    if player_id.count() == 0:
        return JsonResponse({'status': 'failed', 'message': 'Player does not exist in room'})
    else:
        player_id.delete()
        return JsonResponse({'status': 'success', 'message': 'Player left room'})


@api_view(['POST'])
@permission_classes((AllowAny, ))
def getLobbyPlayerStates(request):
    """
    Get the states of players in the lobby based on the given pin in request data.
    """
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    room_id = Room.objects.filter(pin=body['pin'])
    if not room_id.exists():
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    player_ids = Player.objects.filter(room_id=room_id[0])

    # if there are players in the lobby
    # if player_ids:
    serializer = PlayerBaseSerializer(
        player_ids, many=True)  # playernames, scores
    data = {'status': 'success', 'playerScores': serializer.data}

    # if there are no players in the lobby
    # else:
    #     data={'status': 'failed', 'message': 'Room does not exist or no players in lobby'}
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def joinGame(request):
    """
A view for joining a game. It takes a POST request with the pin and playername in the body. 
If the room with the provided pin exists, it adds the player to the room and returns a JSON response with the list of players in the room. 
If the room does not exist, it returns a JSON response with a failure message.

Parameters:
- `request` (HttpRequest): The HTTP request object.

Returns:
- `JsonResponse`: A JSON response with a status key and a message key. If the status is 'success', the message key contains 
a list of players in the room. If the status is 'failed', the message key contains a failure message.

Permissions:
    - AllowAny: This view allows any user to access it.
"""

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    playername = body['playername']

    room_id = Room.objects.filter(pin=pin)
    if not room_id.exists():
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})

    player = Player.objects.create(
        playername=playername, score=0, room_id=room_id[0])
    playersInGame = Player.objects.filter(room_id=room_id[0])
    serializer = PlayerBaseSerializer(playersInGame, many=True)
    data = {'status': 'success', 'players': serializer.data}
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def getQuizInfo(request):
    # {"pin": String, "playername": String}
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    pin = body['pin']

    room_id = Room.objects.filter(pin=pin)

    if not room_id.exists():
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})

    quiz = Room.objects.filter(pin=pin)[0].quiz_id

    round_ids = Round.objects.filter(quiz_id=quiz)
    r_serializer = RoundIDSerializer(round_ids, many=True)
    r_array = list(map(lambda x: x['id'], r_serializer.data))
    data = {'status': 'success', 'id': quiz.id, 'round_ids': r_array}
    return JsonResponse(data, safe=False)

# ---------------------------------------

# Host Views -------------------


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def createRoom(request):
    # Get body of request
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    # If quiz does not exist, send failure.
    if not Quiz.objects.filter(id=body["quiz_id"]).exists():
        return JsonResponse({'status': 'failed', 'message': 'Quiz does not exist', 'data': "NoQuizFound"})

    try:
        # Get quiz and first round
        quiz_id = Quiz.objects.get(id=body["quiz_id"])
        round_id = Round.objects.filter(quiz_id=quiz_id, index=0)

        # Create host for user if does not exist
        if Host.objects.filter(user_id=request.user.id).count() == 0:
            Host.objects.create(user_id=request.user.id)

        # Get Host
        host_id = Host.objects.get(user_id=request.user.id)

        # Delete rooms if rooms by same name exists
        print(list(Room.objects.filter(pin=body["pin"])))
        for room in list(Room.objects.filter(pin=body["pin"])):
            room.delete()
        Room.objects.filter(pin=body["pin"]).delete()

        Room.objects.create(pin=body["pin"], host_id=host_id,
                            quiz_id=quiz_id, round_id=round_id[0], round_end_time=timezone.now())
        return JsonResponse({'status': 'success', 'message': 'Room created'})
    except Exception as e:
        return JsonResponse({'status': 'failed', 'message': str(e), "issue_where": "creatingRoom"})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def deleteRoom(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    room_id = Room.objects.filter(pin=body['pin'])
    if room_id.count() == 0:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    host_id = Host.objects.filter(user_id=request.user.id)
    if host_id.count() == 0:
        return JsonResponse({'status': 'failed', 'message': 'Host does not exist'})
    else:
        host_id = host_id[0]
        host_id.delete()
    room_id.delete()
    return JsonResponse({'status': 'success', 'message': 'Room deleted'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def updateRoundData(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    room = Room.objects.get(pin=body["pin"])
    quiz = room.quiz_id
    r = Round.objects.filter(quiz_id=quiz)[body["roundIndex"]]
    room.round_end_time = timezone.now() + timezone.timedelta(seconds=r.time)
    print("round end time")
    print(room.round_end_time)
    room.round_id = r
    room.save()

    return JsonResponse({'status': 'success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def getQuestionsToMark(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]
    if not room.host_id.user_id == request.user.id:
        return JsonResponse({'status': 'failed', 'message': 'You are not the host of this room'})

    QuestionAnswers = HostToMarkSerializer(
        HostToMark.objects.filter(room=room), many=True)

    if not QuestionAnswers.data:
        return JsonResponse({'status': 'failed', 'message': 'No questions to mark'})

    data = {'status': 'success', 'data': QuestionAnswers.data}
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def getRoundCount(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]

    # if there is a room that exists then return the number of rounds
    rounds = Round.objects.filter(quiz_id=room.quiz_id).count()

    return JsonResponse({'status': 'success', 'rounds': rounds})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def getQuestionCountPerRound(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]

    questionsPerRound = []
    rounds = Round.objects.filter(quiz_id=room.quiz_id)
    for round in rounds:
        questions = Question.objects.filter(round_id=round.id)
        questionsPerRound.append(
            {"round_index": int(round.index),
             "question_count": int(len(questions))}
        )

    return JsonResponse({'status': 'success', 'data': questionsPerRound})

# for testing


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def createQuestionsToMark(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]
    if not room.host_id.user_id == request.user.id:
        return JsonResponse({'status': 'failed', 'message': 'You are not the host of this room'})
    import random
    possibleAnswers = ["11111111", "22222222", "33333333", "44444444",
                       "55555555", "66666666", "77777777", "88888888", "99999999"]
    rounds = Round.objects.filter(quiz_id=room.quiz_id)

    for r in rounds:
        print(r.index)
        questions = Question.objects.filter(round_id=r)
        for question in questions:

            players = Player.objects.filter(room_id=room)
            random_players = random.choice(players)
            HostToMark.objects.create(room=room,
                                      player=Player.objects.filter(
                                          room_id=room)[0],
                                      question=question,
                                      answer=random.choice(possibleAnswers))
            HostToMark.objects.create(room=room,
                                      player=Player.objects.filter(
                                          room_id=room)[0],
                                      question=question,
                                      answer=random.choice(possibleAnswers))
            HostToMark.objects.create(room=room,
                                      player=Player.objects.filter(
                                          room_id=room)[0],
                                      question=question,
                                      answer=random.choice(possibleAnswers))

    return JsonResponse({'status': 'success', 'message': 'Questions created'})
# END


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def markQuestionWrong(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    q_id = body['questionToMark_id']
    room = Room.objects.filter(pin=pin)
    # question to mark
    query = HostToMark.objects.filter(id=q_id)
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]
    if not query.exists():
        return JsonResponse({'status': 'failed', 'message': 'Question does not exist'})
    if not room.host_id.user_id == request.user.id:
        return JsonResponse({'status': 'failed', 'message': 'You are not the host of this room'})
    query[0].delete()
    return JsonResponse({'status': 'success', 'message': 'Question marked wrong'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def markQuestionRight(request):

    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    # question to mark
    query = HostToMark.objects.filter(id=body['questionToMark_id'])
    player_id = body['player']

    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]

    if not query.exists():
        return JsonResponse({'status': 'failed', 'message': 'Question does not exist'})
    query = query[0]

    if not room.host_id.user_id == request.user.id:
        return JsonResponse({'status': 'failed', 'message': 'You are not the host of this room'})

    player = Player.objects.filter(id=player_id)
    if not player.exists():
        return JsonResponse({'status': 'failed', 'message': 'Player does not exist'})

    player = player[0]
    player.score = player.score + 1
    player.save()
    query.delete()
    return JsonResponse({'status': 'success', 'message': 'Question marked right'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def getModelAnswers(request):
    # Get request body
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    pin = body['pin']
    room = Room.objects.filter(pin=pin)
    round_index = body['round_index']
    question_index = body['question_index']
    # if there is no room that exists then return error
    if not room:
        return JsonResponse({'status': 'failed', 'message': 'Room does not exist'})
    room = room[0]
    if not room.host_id.user_id == request.user.id:
        return JsonResponse({'status': 'failed', 'message': 'You are not the host of this room'})

    quiz = Quiz.objects.filter(id=room.quiz_id.id)
    if not quiz.exists():
        return JsonResponse({'status': 'failed', 'message': 'Quiz does not exist'})

    rounds = Round.objects.filter(quiz_id=quiz[0].id, index=int(round_index))
    if not rounds.exists():
        return JsonResponse({'status': 'failed', 'message': 'Rounds does not exist'})
    rounds = rounds[0]

    questions = Question.objects.filter(round_id=rounds, index=question_index)

    if not questions.exists():
        return JsonResponse({'status': 'failed', 'message': 'Questions does not exist'})
    questions = questions[0]

    return JsonResponse({'status': 'success', 'data': ModelAnswersANDQuestionsTitlesSerializer(questions).data})


@api_view(['POST'])
@permission_classes((AllowAny, ))
def hostGetRound(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    pin = body['pin']

    room = Room.objects.get(pin=pin)

    data = {'end_time': room.round_end_time}
    return JsonResponse(data, safe=False)
