import sys
from things.models import Thing, Tag
from django.contrib.auth.models import User
from rest_framework import viewsets, generics
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

class ThingsList(generics.ListCreateAPIView):
    queryset = Thing.objects.all()
    serializer_class = ThingSerializer

class ThingsViewTagSearch(generics.ListAPIView):
    # model = Thing
    serializer_class = ThingSerializer
    # filter_class = ThingFilter

    def get_queryset(self):
    	searchtag = self.kwargs['searchtag']
    	print >>sys.stderr, searchtag
    	return Thing.objects.all().filter(tag__word=searchtag)