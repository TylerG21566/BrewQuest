# This is for all the data serializers, it converts database output into json format.

from rest_framework import serializers
from .models import *
from django.contrib.auth import hashers


class ClientQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['index', 'prompt']


class HostQuizListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['title', 'id']

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            print(validated_data["password"])
            validated_data["password"] = hashers.make_password(validated_data["password"])
            instance.set_password(validated_data["password"])
            instance.save()
        return super().update(instance, validated_data)

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data["password"] = hashers.make_password(validated_data["password"])
            instance.set_password(validated_data["password"])
            instance.save()
        return super().update(instance, validated_data)

class HostQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['prompt', 'answer','id','index','time']
        
class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id', 'index', 'title', 'topic', 'time']