from rest_framework import viewsets
from ansible_api.permissions import IsSuperUser
from openshift_storage import serializers
from openshift_storage.models.storage_cluster import StorageCluster


class StorageClusterViewSet(viewsets.ModelViewSet):
    queryset = StorageCluster.objects.all().filter()
    serializer_class = serializers.StorageClusterSerializer
    permission_classes = (IsSuperUser,)
    lookup_field = 'name'
    lookup_url_kwarg = 'name'
