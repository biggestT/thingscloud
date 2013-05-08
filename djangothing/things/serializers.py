from things.models import Thing, Owner
from rest_framework import serializers

class ThingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Thing
        fields = ('tag', 'photo', 'time', 'owner')

class OwnerSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Owner
		fields = ('firstname', 'surname')
