import os

import openshift_api
from ansible_api.models import Project, Role, Playbook
from django.db import models
from common.models import JsonTextField
from openshift_api.models.node import Node
__all__ = ['Cluster', 'ClusterConfig']


class Cluster(Project):
    package = models.ForeignKey("Package", null=True, on_delete=models.SET_NULL)
    template = models.CharField(max_length=64, blank=True, default='')
    current_task_id = models.CharField(max_length=128, blank=True, default='')
    is_super = models.BooleanField(default=False)

    @property
    def state(self):
        if not self.current_task_id is "":
            c = openshift_api.models.deploy.DeployExecution.objects.filter(id=self.current_task_id).first()
            return c.state
        return None

    def create_roles(self):
        _roles = {}
        for role in self.package.meta.get('roles', []):
            _roles[role['name']] = role
        template = None
        for tmp in self.package.meta.get('templates', []):
            if tmp['name'] == self.template:
                template = tmp
                break

        for role in template.get('roles', []):
            _roles[role['name']] = role
        roles_data = [role for role in _roles.values()]

        children_data = {}
        for data in roles_data:
            children_data[data['name']] = data.pop('children', [])
            Role.objects.update_or_create(defaults=data, name=data['name'])

        for name, children_name in children_data.items():
            try:
                role = Role.objects.get(name=name)
                children = Role.objects.filter(name__in=children_name)
                role.children.set(children)
            except Role.DoesNotExist:
                pass

        ose_role = Role.objects.get(name='OSEv3')
        private_var = template['private_vars']
        role_vars = ose_role.vars
        role_vars.update(private_var)
        ose_role.vars = role_vars
        ose_role.save()

    def create_node_localhost(self):
        Node.objects.create(
            name="localhost", vars={"ansible_connection": "local"},
            project=self, meta={"hidden": True}
        )

    def create_install_playbooks(self):
        for data in self.package.meta.get('install_playbooks', []):
            url = 'file:///{}'.format(os.path.join(self.package.path))
            Playbook.objects.create(
                name=data['name'], alias=data['alias'],
                type=Playbook.TYPE_LOCAL, url=url, project=self,
            )

    def create_upgrade_playbooks(self):
        for data in self.package.meta.get('upgrade_playbooks', []):
            url = 'file:///{}'.format(os.path.join(self.package.path))
            Playbook.objects.create(
                name=data['name'], alias=data['alias'],
                type=Playbook.TYPE_LOCAL, url=url, project=self,
            )

    def create_uninstall_playbooks(self):
        for data in self.package.meta.get('uninstall_playbooks', []):
            url = 'file:///{}'.format(os.path.join(self.package.path))
            Playbook.objects.create(
                name=data['name'], alias=data['alias'],
                type=Playbook.TYPE_LOCAL, url=url, project=self,
            )

    def on_cluster_create(self):
        self.change_to()
        self.create_roles()
        self.create_node_localhost()
        self.create_install_playbooks()
        self.create_upgrade_playbooks()
        self.create_uninstall_playbooks()

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


class ClusterConfig(models.Model):
    key = models.CharField(max_length=1024)
    value = JsonTextField()

    class Meta:
        abstract = True

    target = models.ForeignKey('ansible_api.Project', related_name="target", on_delete=models.CASCADE)
