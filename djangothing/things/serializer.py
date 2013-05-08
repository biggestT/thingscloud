from things.models import Thing, User
from rest_framework import serializer

class ThingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Thing
        fields = ('tag', 'photo', 'time', 'owner')

class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ('firstname')
