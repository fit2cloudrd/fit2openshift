import logging
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from openshift_base.models.cluster import AbstractCluster

__all__ = ['StorageCluster']
logger = logging.getLogger(__name__)


class StorageCluster(AbstractCluster):
    pass


@receiver(post_save, sender=StorageCluster)
def on_cluster_save(sender, instance=None, **kwargs):
    print(instance)
    if instance and instance.template:
        instance.on_cluster_create()
