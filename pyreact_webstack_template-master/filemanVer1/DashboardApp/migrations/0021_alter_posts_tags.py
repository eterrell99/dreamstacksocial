# Generated by Django 4.2.6 on 2024-02-16 22:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0020_tagsaves_postsaves'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='tags',
            field=models.ManyToManyField(blank=True, to='DashboardApp.tag'),
        ),
    ]
