import sys
from things.models import Thing, Tag
from things.permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from things.serializers import ThingSerializer, UserSerializer, TagSerializer
from rest_framework import permissions

class ThingsViewSet(viewsets.ModelViewSet):
	queryset = Thing.objects.all()
	serializer_class = ThingSerializer

class UsersViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TagsViewSet(viewsets.ModelViewSet):
	queryset = Tag.objects.all()
	serializer_class = TagSerializer

class ThingDetails(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)
    queryset = Thing.objects.all()
    serializer_class = ThingSerializer
    def pre_save(self, obj):
        obj.owner = self.request.user
    

class ThingsList(generics.ListCreateAPIView):   
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)
    queryset = Thing.objects.all()
    serializer_class = ThingSerializer
    # def pre_save(self, obj):
    #     obj.owner = self.request.user

class ThingsViewTagSearch(generics.ListAPIView):
    serializer_class = ThingSerializer

    def get_queryset(self):
        # searchtags = self.kwargs['searchtag'].split('%20')
    	searchtag = self.kwargs['searchtag']

    	return Thing.objects.all().filter(tag__word__icontains=searchtag)
