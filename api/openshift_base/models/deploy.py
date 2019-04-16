import logging
from ansible_api.models.mixins import AbstractProjectResourceModel, AbstractExecutionModel
from django.db import models
from openshift_api.models.cluster import Cluster
from django.utils.translation import ugettext_lazy as _
from openshift_api.models.setting import Setting
from openshift_api.signals import pre_deploy_execution_start, post_deploy_execution_start
__all__ = ['DeployExecution']
logger = logging.getLogger(__name__)


class DeployExecution(AbstractProjectResourceModel, AbstractExecutionModel):
    OPERATION_INSTALL = 'install'
    OPERATION_UPGRADE = 'upgrade'
    OPERATION_UNINSTALL = 'uninstall'
    OPERATION_UPDATE = 'update'

    OPERATION_CHOICES = (
        (OPERATION_INSTALL, _('install')),
        (OPERATION_UPGRADE, _('upgrade')),
        (OPERATION_UNINSTALL,_('uninstall')),
        (OPERATION_UPDATE,_('update')),
    )

    project = models.ForeignKey('ansible_api.Project', on_delete=models.CASCADE)
    operation = models.CharField(max_length=128, choices=OPERATION_CHOICES, blank=True, default=OPERATION_INSTALL)
    current_task = models.CharField(max_length=128, null=True, blank=True, default=None)
    progress = models.FloatField(max_length=64, null=True, blank=True, default=0.0)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        super().save(force_insert, force_update, using, update_fields)
        Cluster.objects.filter(id=self.project.id).update(current_task_id=self.id)

    def start(self):
        local_hostname = Setting.objects.filter(key="local_hostname").first()
        registry_hostname = Setting.objects.filter(key="registry_hostname").first()
        result = {"raw": {}, "summary": {}}
        pre_deploy_execution_start.send(self.__class__, execution=self)
        playbooks = self.project.playbook_set.filter(name__endswith='-' + self.operation).order_by('name')
        try:
            for index, playbook in enumerate(playbooks):
                print("\n>>> Start run {} ".format(playbook.name))
                self.update_task(playbook.name)
                _result = playbook.execute(extra_vars={
                    "cluster_name": self.project.name,
                    "registry_hostname": registry_hostname.value,
                    "local_hostname": local_hostname.value
                })
                result["summary"].update(_result["summary"])
                if not _result.get('summary', {}).get('success', False):
                    break
                else:
                    self.update_progress((index + 1) / len(playbooks))
                if len(playbooks) == index + 1:
                    self.update_task('Finish')
        except Exception as e:
            logger.error(e, exc_info=True)
            result['summary'] = {'error': 'Unexpect error occur: {}'.format(e)}
        post_deploy_execution_start.send(self.__class__, execution=self, result=result)
        return result

    def update_task(self, task):

        self.current_task = task
        self.save()

    def update_progress(self, progress):
        self.progress = progress
        self.save()

    def to_json(self):
        return {
            'id': self.id.__str__(),
            'progress': self.progress,
            'current_task': self.current_task,
            'operation': self.operation,
            'state': self.state
        }

    class Meta:
        get_latest_by = 'date_created'
        ordering = ('-date_created',)
