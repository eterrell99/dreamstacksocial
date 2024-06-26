# Generated by Django 4.2.6 on 2023-10-09 14:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('DashboardApp', '0005_commentlikes_postlikes_delete_likes'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='comment',
            new_name='CommentText',
        ),
        migrations.AddField(
            model_name='comment',
            name='is_reply',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='comment',
            name='parent_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='DashboardApp.comment'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='parent_post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='DashboardApp.posts'),
        ),
    ]
