
from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from django.db import models

from api.models import Quiz,Host,Round,Question




# Room is a hosted quiz
class Room(models.Model):
     # id pk is automatically created by django

    # who is running the game
    host_id = models.ForeignKey(Host, on_delete=models.CASCADE)
    # which quiz is running
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    # which round is running
    round_id = models.ForeignKey(Round, on_delete=models.CASCADE)
    # password to join
    pin = models.CharField(max_length=16)
    # time current round ends
    round_end_time = models.DateTimeField()
    def __str__(self):
        return f"room_id: {id}, pin: {self.pin}"

'''
class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
'''
    
# Particapants in the room/game
class Player(models.Model):
    # user choosen name
    playername = models.CharField(max_length=255)
    # which room they belong to
    room_id = models.ForeignKey(Room, related_name='players', on_delete=models.CASCADE)
    # their score
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"name: {self.playername}, room_id: {self.room_id}, score: {self.score}"
    

class HostToMark(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE) # not sure if question should be a foreign key or just text
    # probz easier just as text but could be easier to fetch root answer with it as a foriegn key
    answer = models.CharField(max_length=255)

    def __str__(self):
        return f"room: {self.room}, player: {self.player}, question: {self.question}, answer: {self.answer}"

    



