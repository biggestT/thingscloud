# Create your views here.
from things.models import Thing, Owner
from rest_framework import viewsets
from things.serializers import ThingSerializer, OwnerSerializer

class ThingViewSet(viewsets.ModelViewSet):
	queryset = Thing.objects.all()
	serializer_class = ThingSerializer

class OwnerViewSet(viewsets.ModelViewSet):
	queryset = Owner.objects.all()
	serializer_class = OwnerSerializer