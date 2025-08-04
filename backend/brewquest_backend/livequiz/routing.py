from channels.routing import ProtocolTypeRouter, URLRouter
# import app.routing
from django.urls import re_path
from .consumers import *
from channels.auth import AuthMiddlewareStack
websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', ChatConsumer.as_asgi()),
    re_path(r'^room/(?P<room_name>[^/]+)/$', RoomConsumer.as_asgi()),
]
# the websocket will open at 127.0.0.1:8000/ws/<room_name> and 127.0.0.1:8000/room/<room_name>

application = ProtocolTypeRouter({
    'websocket':AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),


})