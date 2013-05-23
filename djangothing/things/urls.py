from django.conf.urls import patterns, url, include
from rest_framework import routers
from things import views

router = routers.DefaultRouter()
router.register(r'owners', views.UsersViewSet)
router.register(r'tags', views.TagsViewSet)
# router.register(r'things', views.ThingsViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^', include(router.urls)),
	url(r'^add', views.ThingsList.as_view()),
	url(r'^things/(?P<pk>[0-9]+)/$', views.ThingDetails.as_view()),
    url(r'^search/(?P<searchtag>.+)/$', views.ThingsViewTagSearch.as_view()),
    url(r'^add', views.ThingsList.as_view()),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    url(r'^users/$', views.UserList.as_view()),
	url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
)