from django.db import models


        
# Create your models here.
class Thing(models.Model):
	tag = models.ManyToManyField('Tag')
	photo = models.CharField(max_length=50)
	time = models.DateTimeField(auto_now_add=True)
	owner = models.ForeignKey('auth.User', related_name='things')

	def save(self, *args, **kwargs):
		super(Thing, self).save(*args, **kwargs)

class Tag(models.Model):
	word = models.CharField(max_length=30, primary_key=True)
	time = models.DateTimeField(auto_now_add=True)	