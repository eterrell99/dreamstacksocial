# Generated by Django 4.2.6 on 2023-11-07 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0008_postattachment_commentattachment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postattachment',
            name='file',
            field=models.FileField(upload_to='attachments/posts/'),
        ),
    ]
