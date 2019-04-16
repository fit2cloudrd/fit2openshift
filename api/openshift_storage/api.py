from rest_framework import viewsets
from ansible_api.permissions import IsSuperUser
from openshift_api.models.cluster import OpenshiftCluster
from openshift_base import serializers


class OpenshiftClusterViewSet(viewsets.ModelViewSet):
    queryset = OpenshiftCluster.objects.all().filter()
    serializer_class = serializers.ClusterSerializer
    permission_classes = (IsSuperUser,)
    lookup_field = 'name'
    lookup_url_kwarg = 'name'
