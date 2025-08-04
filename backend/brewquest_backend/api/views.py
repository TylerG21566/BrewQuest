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
from rest_framework import generics
from django.contrib.auth.models import User
# Create your views here.



@api_view(['POST'])
def register(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    email = body['email']
    password = body['password']
    username = body['username']
    if User.objects.filter(username=username).count() > 0:
        return Response({'status': 'failed', 'message': 'Username taken, try another.'})
    if username.strip() == "" or email.strip() == "" or password.strip() == "":
        return Response({'status': 'failed', 'message': 'Field(s) left empty'})

    try:
        user = User.objects.create_user(
            email=email, username=username, password=password)
    except Exception as error:
        print("Uh oh: ", error)

    return Response({'Status': 'Success'})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def quizzes(request):
    quizzes = Quiz.objects.filter(user_id=request.user)
    serializer = HostQuizListSerializer(quizzes, many=True)
    data = {'quizzes': serializer.data}
    return JsonResponse(data, safe=False)




# HOST QUIZ EDIT PAGE -------------------

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def updateQuizName(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    quiz_id = body['quiz_id']
    name = body['name']
    q = Quiz.objects.get(id=quiz_id)
    q.title = name
    q.save()

    return Response({'Status': 'Success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def getRoundsQuestions(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print("Current highest round " + str(Round.objects.last().id))
    print("Round ids:")
    print(*body['r'])
    try:
        print("round index "+str(body['number']))
        
        round_id = body['round_id']
        print(round_id)
    except:
        print("Key error")
        return Response({'Status': 'Fail'})
    
    questions = Question.objects.filter(round_id=round_id)
    serializer = HostQuestionSerializer(questions, many=True)
    data = serializer.data
    return JsonResponse(data, safe=False)



@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def createRound(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    quiz_id = body['quiz_id']
    quiz = Quiz.objects.get(id=quiz_id)
    index = Round.objects.filter(quiz_id=quiz).count()

    new_round = Round(title="", quiz_id=quiz, index=index, time=30)
    new_round.save()
    new_question = Question(prompt="",
                            answer="", last_changed=timezone.now(), round_id=new_round, time=30, index=0)
    new_question.save()
    return Response({'Status': 'Success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def deleteRound(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    round_id = body['round_id']
    r = Round.objects.get(id=round_id)
    r.delete()

    return Response({'Status': 'Success'})

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def updateRoundName(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    round_id = body['round_id']
    name = body['name']
    r = Round.objects.get(id=round_id)
    r.title = name
    r.save()

    return Response({'Status': 'Success'})

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def createQuestion(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    round_id = body['round_id']
    r = Round.objects.get(id=round_id)
    print(r.title + " New question added")
    index = Question.objects.filter(round_id=r).count()
    new_question = Question(prompt="",
                            answer="", last_changed=timezone.now(), round_id=r, time=30, index=index)
    new_question.save()
    return Response({'Status': 'Success'})

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def deleteQuestion(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    question_id = body['question_id']
    q = Question.objects.get(id=question_id)
    q.delete()

    return Response({'Status': 'Success'})

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def updateQuestion(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    question_id = body['question_id']
    prompt = body['prompt']
    answer = body['answer']
    q = Question.objects.get(id=question_id)
    q.prompt = prompt
    q.answer = answer
    q.save()

    return Response({'Status': 'Success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def quizInfo(request):
    # Provides information on the name of the quiz and the rounds
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    quiz_id = body['quiz_id']
    quiz = Quiz.objects.get(id=quiz_id)
    name = quiz.title
    rounds = Round.objects.filter(quiz_id=quiz_id)
    round_serializer = RoundSerializer(rounds, many=True)

    data = {
        'name': name,
        'rounds': round_serializer.data
    }

    return JsonResponse(data, safe=False)


# ---------------------------------------

# HOST QUIZ LIST PAGE -------------------


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def createQuiz(request):
    new_quiz = Quiz(title="New Quiz", user_id=request.user)
    new_quiz.save()
    new_round = Round(title="", quiz_id=new_quiz, index=0, time=30)
    new_round.save()
    new_question = Question(prompt="",
                            answer="", last_changed=timezone.now(), round_id=new_round, time=30, index=0)
    new_question.save()
    return Response({'Status': 'Success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def duplicateQuiz(request):
    # Gets quiz in question, pardon the pun
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    quiz_id = body['id']
    quiz = Quiz.objects.get(id=quiz_id)
    duplicate_quiz = Quiz(title=quiz.title+" copy", user_id=request.user)
    duplicate_quiz.save()

    rounds = Round.objects.filter(quiz_id=quiz_id)
    for r in rounds:
        duplicate_round = Round(
            title=r.title, quiz_id=duplicate_quiz, topic=r.topic, time=r.time, index=r.index)
        duplicate_round.save()
        questions = Question.objects.filter(round_id=r.id)
        for q in questions:
            # TODO: Deleted items not cascading
            duplicate_question = Question(
                index=q.index, round_id=duplicate_round, prompt=q.prompt, answer=q.answer, time=q.time, last_changed=timezone.now())
            duplicate_question.save()

    return Response({'Status': 'Success'})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def deleteQuiz(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    quiz_id = body['id']
    quiz = Quiz.objects.get(id=quiz_id)
    quiz.delete()
    return Response({'Status': 'Success'})

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def changeName(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializers(instance=user, data=request.data, partial=True)
    if (User.objects.filter(username=request.data['username']).exists()):
        return Response({'Response': 'Username already exists'})
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({'response': 'something went wrong'})
        
    return Response({'Status': 'Success'})

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def changeEmail(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializers(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({'response': 'something went wrong'})
        
    return Response({'Status': 'Success'})

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def checkPassword(request,pk):
    user = User.objects.get(id=pk)
    if user is None:
        return Response({"Response": "User not found"})
    if not user.check_password(request.data.get('currentPassword')):
        return Response({"Response" : "Password is not correct"})
    return Response({"Response": "Password matches"})

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def changePassword(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializers(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({'response': 'something went wrong'})
        
    return Response({'Status': 'Success'})

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def deleteUser(request,pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response({'Status': 'Success'})


class HomeView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        content = {
            'message': 'Success'}
        return Response(content)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)




