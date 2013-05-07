
from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'djangothing.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url( r'^search/', include( 'ajaxsearch.urls' )),
)

# urlpatterns += patterns('',
#     (r'^media/(?P.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT,'show_indexes': True}),
#     (r'(?:.*?/)?(?P(css|jquery|jscripts|images)/.+)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT }),
# )
