from django.contrib import admin
from .models import Posts, Comment, CommentLikes, PostLikes, Tag, File
# Register your models here.
admin.site.register(File)
admin.site.register(Posts)
admin.site.register(Comment)
admin.site.register(CommentLikes)
admin.site.register(PostLikes)
admin.site.register(Tag)