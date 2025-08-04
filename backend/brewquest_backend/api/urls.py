
from django.urls import path
from . import views

urlpatterns = [
    path('quizInfo/', views.quizInfo, name='quizInfo'),
    path('getRoundsQuestions/', views.getRoundsQuestions,
         name='getRoundsQuestions'),
    path('createQuiz/', views.createQuiz, name='createQuiz'),
    path('createRound/', views.createRound, name='createRound'),
    path('createQuestion/', views.createQuestion, name='createQuestion'),
    path('updateQuestion/', views.updateQuestion, name='updateQuestion'),
    path('deleteQuestion/', views.deleteQuestion, name='deleteQuestion'),
    path('deleteRound/', views.deleteRound, name='deleteRound'),    
    path('updateRoundName/', views.updateRoundName, name='updateRoundName'),
    path('updateQuizName/', views.updateQuizName, name='updateQuizName'),
    path('register/', views.register, name='register'),
    path('deleteQuiz/', views.deleteQuiz, name='deleteQuiz'),
    path('duplicateQuiz/', views.duplicateQuiz, name='duplicateQuiz'),
    path('quizzes/', views.quizzes, name='quizzes'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('change_username/<int:pk>', views.changeName, name='change_username'),
    path('change_email/<int:pk>', views.changeEmail, name='change_email'),
    path('check_password/<int:pk>', views.checkPassword, name='check_password'),
    path('change_password/<int:pk>', views.changePassword, name='change_password'),
    path('delete_user/<int:pk>', views.deleteUser, name='delete_user'),

]
