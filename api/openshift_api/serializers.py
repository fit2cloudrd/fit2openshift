from rest_framework import serializers
from django.shortcuts import reverse

from ansible_api.serializers import GroupSerializer, ProjectSerializer, Role
from ansible_api.serializers import HostSerializer as AnsibleHostSerializer
from ansible_api.serializers.inventory import HostReadSerializer
from openshift_api.models.cluster import OpenshiftCluster
from openshift_base.models.package import Package

__all__ = [
    'OpenshiftClusterSerializer',
]


class OpenshiftClusterSerializer(serializers.ModelSerializer):
    package = serializers.SlugRelatedField(
        queryset=Package.objects.all(), slug_field='name', required=False
    )

    class Meta:
        model = OpenshiftCluster
        fields = ['id', 'name', 'package', 'template', 'comment', 'date_created']
        read_only_fields = ['id', 'date_created']


class ClusterConfigSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=128)
    value = serializers.JSONField()
