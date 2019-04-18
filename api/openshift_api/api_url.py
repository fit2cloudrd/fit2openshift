from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from openshift_api import api

app_name = "openshift_api"
router = DefaultRouter()

router.register('openshift', api.OpenshiftClusterViewSet, 'openshift')
cluster_router = routers.NestedDefaultRouter(router, r'openshift', lookup='openshift')
cluster_router.register(r'configs', api.ClusterConfigViewSet, 'cluster-config')

urlpatterns = [
              ] + router.urls + cluster_router.urls
