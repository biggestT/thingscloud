from django.conf.urls import patterns, url, include
from rest_framework import routers
from things import views

router = routers.DefaultRouter()
router.register(r'thing', views.ThingViewSet)
router.register(r'owner', views.OwnerViewSet)
router.register(r'tag', views.TagViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)