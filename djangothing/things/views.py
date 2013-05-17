# Create your views here.
from things.models import Thing, Tag
from django.contrib.auth.models import User
from rest_framework import viewsets
from things.serializers import ThingSerializer, UserSerializer, TagSerializer

class ThingsViewSet(viewsets.ModelViewSet):
	queryset = Thing.objects.all()
	serializer_class = ThingSerializer

class UsersViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class TagsViewSet(viewsets.ModelViewSet):
	queryset = Tag.objects.all()
	serializer_class = TagSerializer