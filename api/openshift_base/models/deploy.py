import logging

from ansible_api.models.mixins import AbstractProjectResourceModel, AbstractExecutionModel
from django.db import models
from openshift_base.models.cluster import AbstractCluster
from openshift_base.signals import pre_deploy_execution_start, post_deploy_execution_start

__all__ = ['DeployExecution']
logger = logging.getLogger(__name__)


class DeployExecution(AbstractProjectResourceModel, AbstractExecutionModel):
    project = models.ForeignKey('ansible_api.Project', on_delete=models.CASCADE)
    operation = models.CharField(max_length=128, blank=False, null=False)

    def start(self, extra_vars, operation):
        result = {"raw": {}, "summary": {}}
        pre_deploy_execution_start.send(self.__class__, execution=self)
        cluster = AbstractCluster.objects.filter(id=self.project.id).first()
        template_meta = cluster.get_template_meta()
        try:
            for opt in template_meta.operations:
                if opt.name == operation:
                    for playbook in opt.playbooks:
                        print("\n>>> Start run {} ".format(playbook.name))
                        _result = playbook.execute(extra_vars=extra_vars)
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
