from rest_framework.views import APIView    
from rest_framework import permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib import auth

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        data = self.request.data

        username = data['username']
        password = data['password']

        # checking if the user exists
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            # saving the user ID in the session
            auth.login(request, user)
            return Response({'Success' : 'User has been logged in'})
        else:
            return Response({'Error' : 'Username or password is incorrect'})

# TO-DO: Make a logout and delete view, remember to set the appropiate permissions

# the method decorator ensures that the person accessing the website has a token first, dispatch is the post method
@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    def post(self, request):
        data = self.request.data

        email = data['email']
        username = data['username']
        password = data['password']
        retyped_password = data['retyped_password']

        if (password == retyped_password):
            if User.objects.filter(email=email).exists():
                return Response({'Error' : 'Email already exists'})
            elif User.objects.filter(username=username).exists():
                return Response({'Error' : 'Username already exists'})
            else:
                user = User.objects.create_user(email=email, username=username, password= password)
                user.save()
                return Response({'Success' : 'User has been created'})
        else:
            return Response({'Error' : 'Passwords do not match'})
            

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request):
        return Response({'Success' : 'Token has successfully been set'})
