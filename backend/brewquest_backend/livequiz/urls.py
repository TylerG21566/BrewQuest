from django.urls import path
from . import views

urlpatterns = [
    path('getLobbyPlayerStates/', views.getLobbyPlayerStates,
         name='getLobbyPlayerStates'),
    path('joinGame/', views.joinGame, name='joinGame'),
    path('playerLeftLobby/', views.playerLeftLobby, name='playerLeftLobby'),
    path('createRoom/', views.createRoom, name='createRoom'),
    path('deleteRoom/', views.deleteRoom, name='deleteRoom'),
    path('getQuizInfo/', views.getQuizInfo, name='getQuizInfo'),
    path('updateRoundData/', views.updateRoundData, name='updateRoundData'),
    path('clientGetRound/', views.clientGetRound, name='clientGetRound'),
    path('getLeaderboard/', views.getLeaderboard, name='getLeaderboard'),
    path('submitAnswer/', views.submitAnswer, name='submitAnswer'),
    path('getQuestionsToMark/', views.getQuestionsToMark,
         name='getQuestionsToMark'),
    path('createQuestionsToMark/', views.createQuestionsToMark,
         name='createQuestionsToMark'),
    path('getRoundCount/', views.getRoundCount, name='getRoundCount'),
    path('getQuestionCountPerRound', views.getQuestionCountPerRound,
         name='getQuestionCountPerRound'),
    path('markQuestionWrong/', views.markQuestionWrong, name='markQuestionWrong'),
    path('markQuestionRight/', views.markQuestionRight, name='markQuestionRight'),
    path('getModelAnswers/', views.getModelAnswers, name='getModelAnswers'),
    path('hostGetRound/', views.hostGetRound, name='hostGetRound'),
]
