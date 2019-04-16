from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from openshift_api import api

app_name = "openshift_api"
router = DefaultRouter()

router.register('openshift/clusters', api.OpenshiftClusterViewSet, 'openshift-cluster')
urlpatterns = [
              ] + router.urls
