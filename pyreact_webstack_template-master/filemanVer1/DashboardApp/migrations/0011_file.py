# Generated by Django 4.2.6 on 2023-11-07 19:58

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0010_remove_postattachment_post_delete_commentattachment_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('file', models.FileField(upload_to='')),
            ],
        ),
    ]