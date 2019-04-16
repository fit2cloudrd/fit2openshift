from django.apps import AppConfig


class OpenshiftBaseConfig(AppConfig):
    name = 'openshift_base'

    def ready(self):
        from . import signal_handlers
