# Generated by Django 2.1.2 on 2019-04-08 07:55

from django.db import migrations



class Migration(migrations.Migration):
    dependencies = [
        ('openshift_api', '0013_auto_20190327_0432'),
    ]

    def forwards_func(apps, schema_editor):
        Setting = apps.get_model("openshift_api", "Setting")
        db_alias = schema_editor.connection.alias
        Setting.objects.using(db_alias).bulk_create([
            Setting(name="域名后缀", key="domain_suffix", order=1, value=".f2o", helper="eg:.f2o"),
        ])

    def reverse_func(apps, schema_editor):
        Setting = apps.get_model("openshift_api", "Setting")
        db_alias = schema_editor.connection.alias
        Setting.objects.using(db_alias).filter(key='domain_suffix').delete()

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]