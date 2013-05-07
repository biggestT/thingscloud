from django.conf.urls import *
from ajaxsearch.views import *

urlpatterns = patterns( '',
         url( r'^$', index, name = 'demo_index' ),
         url( r'^users/$', ajax_user_search, name = 'demo_user_search' ),
                              )