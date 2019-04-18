from rest_framework import serializers
from django.shortcuts import reverse

from ansible_api.serializers import GroupSerializer, ProjectSerializer, Role
from ansible_api.serializers import HostSerializer as AnsibleHostSerializer
from ansible_api.serializers.inventory import HostReadSerializer
from openshift_api.models.cluster import OpenshiftCluster
from openshift_base.models.package import Package
from openshift_storage.models.storage_cluster import StorageCluster

__all__ = [
    'StorageClusterSerializer',
]


class StorageClusterSerializer(serializers.ModelSerializer):
    package = serializers.SlugRelatedField(
        queryset=Package.objects.all(), slug_field='name', required=False
    )

    class Meta:
        model = StorageCluster
        fields = ['id', 'name', 'package', 'template', 'comment', 'date_created', ]
        read_only_fields = ['id', 'date_created']
