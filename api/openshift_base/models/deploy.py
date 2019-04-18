import logging

from ansible_api.models.mixins import AbstractProjectResourceModel, AbstractExecutionModel
from django.db import models
from openshift_base.models.cluster import AbstractCluster
from openshift_base.signals import pre_deploy_execution_start, post_deploy_execution_start
from common import models as common_models

__all__ = ['DeployExecution']
logger = logging.getLogger(__name__)


class DeployExecution(AbstractProjectResourceModel, AbstractExecutionModel):
    project = models.ForeignKey('ansible_api.Project', on_delete=models.CASCADE)
    operation = models.CharField(max_length=128, blank=False, null=False)
    extra_vars = common_models.JsonDictTextField(default={})

    def start(self):
        result = {"raw": {}, "summary": {}}
        pre_deploy_execution_start.send(self.__class__, execution=self)
        cluster = AbstractCluster.objects.filter(id=self.project.id).first()
        template = None
        for temp in cluster.package.meta.get('templates', []):
            if temp['name'] == cluster.template:
                template = temp
        try:
            for opt in template.get('operations', []):
                if opt['name'] == self.operation:
                    for playbook_name in opt.get('playbooks'):
                        print("\n>>> Start run {} ".format(playbook_name))
                        playbook = self.project.playbook_set.filter(name=playbook_name).first()
                        _result = playbook.execute(extra_vars=self.extra_vars)
                        result["summary"].update(_result["summary"])
                        if not _result.get('summary', {}).get('success', False):
                            break
        except Exception as e:
            logger.error(e, exc_info=True)
            result['summary'] = {'error': 'Unexpect error occur: {}'.format(e)}
        post_deploy_execution_start.send(self.__class__, execution=self, result=result)
        return result

    class Meta:
        get_latest_by = 'date_created'
        ordering = ('-date_created',)
