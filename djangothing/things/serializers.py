from things.models import Thing, Owner, Tag
from rest_framework import serializers

class ThingSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Thing
		fields = ('tag', 'photo', 'time', 'owner')

		def restore_object(self, attrs, instance=None):
			"""
			Create or update a new snippet instance, given a dictionary
			of deserialized field values.

			Note that if we don't define this method, then deserializing
			data will simply return a dictionary of items.
			"""
			if instance:
				# Update existing instance
				instance.tags = attrs.get('tag', instance.tags)
				instance.photo = attrs.get('photo', instance.photo)
				instance.time = attrs.get('time', instance.time)
				instance.owner = attrs.get('owner', instance.owner)
			return instance

			# Create new instance
			return Thing(**attrs)

class OwnerSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Owner
		fields = ('firstname', 'surname')

		def restore_object(self, attrs, instance=None):
		
			if instance:
			# Update existing instance
				instance.firstname = attrs.get('firstname', instance.firstname)
				instance.surname = attrs.get('surname', instance.surname)
				return instance

				# Create new instance
			return Owner(**attrs)

class TagSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Tag
		fields = ('word', 'time')

		def restore_object(self, attrs, instance=None):
	
			if instance:
			# Update existing instance
				instance.word = attrs.get('word', instance.word)
				instance.time = attrs.get('time', instance.time)
				return instance

				# Create new instance
			return Tag(**attrs)