from rest_framework.routers import DefaultRouter
from openshift_storage import api

app_name = "openshift_storage"
router = DefaultRouter()

router.register('storage', api.StorageClusterViewSet, 'storage')
urlpatterns = [
              ] + router.urls
