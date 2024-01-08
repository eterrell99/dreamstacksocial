# Generated by Django 4.2.6 on 2023-11-07 23:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0013_file_user_alter_file_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='comment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='DashboardApp.comment'),
        ),
        migrations.AddField(
            model_name='file',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='DashboardApp.posts'),
        ),
    ]