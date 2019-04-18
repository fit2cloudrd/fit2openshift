from rest_framework import viewsets
from rest_framework.response import Response
from django.db import transaction
from ansible_api.permissions import IsSuperUser
from openshift_base.models.cluster import AbstractCluster
from openshift_base.models.deploy import DeployExecution
from openshift_base.models.host import HostInfo, Host
from openshift_base.models.node import Node
from openshift_base.models.package import Package
from openshift_base.models.role import Role
from openshift_base.models.setting import Setting
from . import serializers
from .mixin import ClusterResourceAPIMixin
from .tasks import start_deploy_execution
from django.db.models import Q


class ClusterViewSet(viewsets.ModelViewSet):
    queryset = AbstractCluster.objects.all().filter()
    serializer_class = serializers.ClusterSerializer
    permission_classes = (IsSuperUser,)
    lookup_field = 'name'
    lookup_url_kwarg = 'name'


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = serializers.PackageSerializer
    permission_classes = (IsSuperUser,)
    http_method_names = ['get', 'head', 'options']
    lookup_field = 'name'
    lookup_url_kwarg = 'name'

    def get_queryset(self):
        Package.lookup()
        return super().get_queryset()


class RoleViewSet(ClusterResourceAPIMixin, viewsets.ModelViewSet):
    queryset = Role.objects.all()
    permission_classes = (IsSuperUser,)
    serializer_class = serializers.RoleSerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'name'


class NodeViewSet(ClusterResourceAPIMixin, viewsets.ModelViewSet):
    queryset = Node.objects.filter(~Q(name='localhost'))
    serializer_class = serializers.NodeSerializer
    permission_classes = (IsSuperUser,)
    lookup_field = 'name'
    lookup_url_kwarg = 'name'

    def create(self, request, *args, **kwargs):
        print("Create ...")
        return super().create(request, *args, **kwargs)


class HostViewSet(viewsets.ModelViewSet):
    queryset = Host.objects.all()
    serializer_class = serializers.HostSerializer
    permission_classes = (IsSuperUser,)

    def perform_create(self, serializer):
        instance = serializer.save()
        transaction.on_commit(lambda: instance.gather_info())





# 节点视图


class DeployExecutionViewSet(ClusterResourceAPIMixin, viewsets.ModelViewSet):
    queryset = DeployExecution.objects.all()
    serializer_class = serializers.DeployExecutionSerializer
    permission_classes = (IsSuperUser,)
    read_serializer_class = serializers.DeployExecutionSerializer

    http_method_names = ['post', 'get', 'head', 'options']

    def perform_create(self, serializer):
        instance = serializer.save()
        transaction.on_commit(lambda: start_deploy_execution.apply_async(
            args=(instance.id,), task_id=str(instance.id)
        ))
        return instance


class HostInfoViewSet(viewsets.ModelViewSet):
    queryset = HostInfo.objects.all()
    permission_classes = (IsSuperUser,)
    serializer_class = serializers.HostInfoSerializer
    http_method_names = ['head', 'options', 'post']

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.gather_info()


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    permission_classes = (IsSuperUser,)
    serializer_class = serializers.SettingSerializer
    http_method_names = ['get', 'head', 'options', 'put', 'patch']
    lookup_field = 'key'
    lookup_url_kwarg = 'key'
