# Create your views here.
from things.models import Thing, Owner, Tag
from rest_framework import viewsets
from things.serializers import ThingSerializer, OwnerSerializer, TagSerializer

class ThingsViewSet(viewsets.ModelViewSet):
	queryset = Thing.objects.all()
	serializer_class = ThingSerializer

class OwnersViewSet(viewsets.ModelViewSet):
	queryset = Owner.objects.all()
	serializer_class = OwnerSerializer

class TagsViewSet(viewsets.ModelViewSet):
	queryset = Tag.objects.all()
	serializer_class = TagSerializer