from django.db import models
from UserApp.models import User
# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Posts(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def user_has_liked(self, user):
        return self.post_likes.filter(user=user).exists()
    
    def user_has_saved(self, user):
        return self.post_saves.filter(user=user).exists()

class Comment(models.Model):    
    CommentText = models.TextField(max_length=1000)
    parent_post = models.ForeignKey(Posts, on_delete=models.CASCADE,related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_reply = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    def user_has_liked(self, user):
        return self.comment_likes.filter(user=user).exists()


class TagSaves(models.Model):    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='tag_saves')

class PostSaves(models.Model):    
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='post_saves')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class CommentLikes(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class PostLikes(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='post_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class File(models.Model):
    post = models.ForeignKey(Posts, related_name='files', on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(Comment,related_name='files', on_delete=models.CASCADE, null=True, blank=True)
    name = models.TextField(max_length=50, null=True)
    file = models.FileField(blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.file.name