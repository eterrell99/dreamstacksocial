# Generated by Django 4.2.6 on 2023-10-09 14:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0003_tag_remove_posts_tag_posts_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='likes',
            name='comment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='DashboardApp.comment'),
        ),
        migrations.AlterField(
            model_name='likes',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='DashboardApp.posts'),
        ),
    ]