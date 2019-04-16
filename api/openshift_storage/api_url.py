from rest_framework.routers import DefaultRouter
from openshift_storage import api

app_name = "openshift_api"
router = DefaultRouter()

router.register('storage/clusters', api.StorageClusterViewSet, 'storage-cluster')
urlpatterns = [
              ] + router.urls
