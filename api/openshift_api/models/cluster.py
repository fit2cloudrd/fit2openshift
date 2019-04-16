from django.db import models

from openshift_base.models.cluster import AbstractCluster
from openshift_base.models.node import Node
from openshift_base.models.role import Role

__all__ = ['OpenshiftCluster']


class OpenshiftCluster(AbstractCluster):
    storages = models.ManyToManyField('openshift_storage.StorageCluster')

    def create_roles(self):
        super().create_roles()
        ose_role = Role.objects.get(name='OSEv3')
        private_var = self.template['private_vars']
        role_vars = ose_role.vars
        role_vars.update(private_var)
        ose_role.vars = role_vars
        ose_role.save()

    def create_node_localhost(self):
        Node.objects.create(
            name="localhost", vars={"ansible_connection": "local"},
            project=self, meta={"hidden": True}
        )

    def configs(self, tp='list'):
        self.change_to()
        role = Role.objects.get(name='OSEv3')
        configs = role.vars
        if tp == 'list':
            configs = [{'key': k, 'value': v} for k, v in configs.items()]
        return configs

    def set_config(self, k, v):
        self.change_to()
        role = Role.objects.select_for_update().get(name='OSEv3')
        _vars = role.vars
        if isinstance(v, str):
            v = v.strip()
        _vars[k] = v
        role.vars = _vars
        role.save()

    def get_config(self, k):
        v = self.configs(tp='dict').get(k)
        return {'key': k, 'value': v}

    def del_config(self, k):
        self.change_to()
        role = Role.objects.get(name='OSEv3')
        _vars = role.vars
        _vars.pop(k, None)
        role.vars = _vars
        role.save()

    def on_cluster_create(self):
        super().on_cluster_create()
        self.create_node_localhost()
