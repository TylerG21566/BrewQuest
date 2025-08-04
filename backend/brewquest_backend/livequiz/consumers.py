# app/consumers.py
import json
from asgiref.sync import async_to_sync, sync_to_async
# from channels.generic.websocket import WebsocketConsumer

from channels.generic.websocket import AsyncWebsocketConsumer
# from .views import *
from .models import *
from .serializer import *

"""This class definition is a WebSocket consumer for handling room-related actions in a chat application.

connect(self): Connects the consumer to a room group.
disconnect(self, close_code): Disconnects the consumer from a room group.
receive(self, text_data): Processes messages received from the WebSocket and forwards them to the appropriate methods based on the type of action.
PlayerLeftLobby(self, event): Sends a message to the WebSocket when a player leaves the lobby.
PlayerJoinedLobby(self, event): Sends a message to the WebSocket when a player joins the lobby.
"""


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        adds a user to a group and accepts websocket connection
        """
        # obtain name of room
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # name of group? think this is the channel layer's name for the group
        self.room_group_name = 'room_%s' % self.room_name
        # Inidiviaul joins room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Accept connection
        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnects the WebSocket connection.

        Parameters:
            close_code (int): The close code sent by the client.

        Returns:
            None
        """
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """takes in a 'dictionary' of data and allows for the apporiate functions to be called
        for example the w

        Args:
            data (_dict_): MUST HAVE A 'type' KEY AND A 'data' KEY,
            data key will consist of a dictionary containing data used in processing
            type key will be a string containing the name of the action being carried our
        """
        ''''''
        # Obtain data and conver to python dictionay
        msg = json.loads(text_data)

        # check for type of request one by one

        if msg["type"] == "PlayerJoinedLobby":  # when player enters lobby
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "PlayerJoinedLobby",
                 'room_id': msg["data"]["room_id"],
                 })

        elif msg["type"] == "PlayerLeftLobby":  # when player leaves lobby
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "PlayerLeftLobby",
                 'room_id': msg["data"]["room_id"],
                 })

        elif msg["type"] == "LobbyClosedByHost":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "LobbyClosedByHost",
                 'room_id': msg["data"]["room_id"],
                 })

        elif msg["type"] == "HostStartGame":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "HostStartGame",
                 'room_id': msg["data"]["room_id"]
                 })

        elif msg["type"] == "HostKicksPlayer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "HostKicksPlayer",
                 'room_id': msg["data"]["room_id"],
                 'playername': msg["data"]["playername"]
                 })

        elif msg["type"] == "ClientSubmittedAnswer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "ClientSubmittedAnswer",
                 'room_id': msg["data"]["room_id"],
                 'playername': msg["data"]["playername"]
                 })

        elif msg["type"] == "HostStartsNextRound":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "HostStartsNextRound",
                 'room_id': msg["data"]["room_id"],
                 })
        elif msg["type"] == "HostMarksAnswer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': "HostMarksAnswer",
                 'room_id': msg["data"]["room_id"],
                 })

# -------------------------
# functions called inside recieve(self, text_data)
    async def LobbyClosedByHost(self, event):
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id
        }))

    async def PlayerLeftLobby(self, event):
        """
        Asynchronously handles the event when a player leaves a lobby.

        Args:
            event (dict): The event data containing information about the player leaving the lobby.
                - type (str): The type of the event.
                - room_id (str): The ID of the room where the player left.

        Returns:
            None
        """
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id
        }))

    async def PlayerJoinedLobby(self, event):
        """
        A function to handle when a player joins a lobby.

        Parameters:
            event (dict): A dictionary containing information about the event,
                          including the type and room_id.

        Returns:
            None
        """
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id
        }))

    async def HostStartGame(self, event):
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id
        }))

    async def HostKicksPlayer(self, event):
        action = event['type']
        room_id = event['room_id']
        playername = event['playername']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id,
            'playername': playername,
        }))

    async def ClientSubmittedAnswer(self, event):
        action = event['type']
        room_id = event['room_id']
        playername = event['playername']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id,
            'playername': playername,
        }))

    async def HostStartsNextRound(self, event):
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id
        }))

    async def HostMarksAnswer(self, event):
        action = event['type']
        room_id = event['room_id']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'room': room_id,
        }))


# ChatConsumer is just a test Consumer for Channels.tsx, do not remove just yet please
# nice to have for reference when creating our main consumer
# below is roughly copied from the official docs tutorial essentially so it works for sure
# helps give a feel of what is going on and the general structure to follow
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        text = text_data_json['text']
        sender = text_data_json['sender']
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': text,
                'sender': sender,
                'room': self.room_name
            }
        )

    async def chat_message(self, event):
        # Receive message from room group
        text = event['message']
        sender = event['sender']
        room = event['room']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'text': text,
            'sender': sender,
            'room': room
        }))
