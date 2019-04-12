import uuid
from django.db import models
from django.utils.translation import ugettext_lazy as _

__all__ = ['Storage']


class Storage(models.Model):
    STORAGE_PROJECT = 'storage_default'
    STORAGE_GLUSTERFS = 'glusterfs'
    STORAGE_NFS = 'nfs'

    STORAGE_TYPE_CHOICES = (
        (STORAGE_GLUSTERFS, _('glusterfs')),
        (STORAGE_NFS, _('nfs')),
    )

    STORAGE_DEPLOYING = 'deploying'
    STORAGE_RUNNING = 'running'
    STORAGE_ERROR = 'error'

    STORAGE_STATE_CHOICES = (
        (STORAGE_DEPLOYING, _('deploying')),
        (STORAGE_RUNNING, _('running')),
        (STORAGE_ERROR, _('error')),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=128, blank=False)
    type = models.CharField(choices=STORAGE_TYPE_CHOICES, max_length=128, null=False, blank=False)
    state = models.CharField(choices=STORAGE_STATE_CHOICES, max_length=128, null=False, blank=False)