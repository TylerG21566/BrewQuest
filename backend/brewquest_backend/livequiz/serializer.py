

from rest_framework import serializers
from .models import *

class PlayerBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['playername', 'score']

class RoundIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id']

class HostQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['prompt', 'answer','id','index','time']
        
class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id', 'index', 'title', 'topic', 'time']

# related serializers
class RoundHostToMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id','index','title']
class QuestionHostToMarkSerializer(serializers.ModelSerializer):

    round_id = RoundHostToMarkSerializer(read_only=True)
    
    class Meta:
        model = Question
        fields = ['index','prompt', 'answer', 'round_id']

class HostToMarkSerializer(serializers.ModelSerializer):
    question = QuestionHostToMarkSerializer(read_only=True)
    class Meta:
        model = HostToMark
        fields = ['id', 'player_id', 'question','answer']
   
# END
class ModelAnswersANDQuestionsTitlesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Question
        fields = ['prompt', 'answer']
