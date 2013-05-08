from django.db import models

# Create your models here.
class Thing(models.Model):
	tag = models.CharField(max_length=30)
	photo = models.URLField()
	time = models.DateTimeField(auto_now_add=True)
	owner = models.ForeignKey('Owner')

class Owner(models.Model):
	firstname = models.CharField(max_length=30)
	surname = models.CharField(max_length=30)