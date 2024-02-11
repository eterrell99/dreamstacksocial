from rest_framework_bulk import (BulkListSerializer,BulkSerializerMixin,)
from .models import Posts, Comment, Tag, PostLikes, CommentLikes,File, PostSaves, TagSaves
from rest_framework import serializers
from UserApp.serializers import UserSerializer
from django.db.models import Count
import json

class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    #post_set = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = '__all__'
    def get_comment_count(self, tag):
        # Assuming you have a Comment model with a ForeignKey to Posts
        post_ids_with_tag = tag.posts_set.values_list('id', flat=True)
        return Comment.objects.filter(parent_post_id__in=post_ids_with_tag).count()
    def get_post_count(self, tag):
        return tag.posts_set.count()
 

    
    
class FileSerializer(serializers.ModelSerializer,BulkSerializerMixin):
    class Meta:
        model = File
        list_serializer_class = BulkListSerializer
        fields = "__all__"   

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user = UserSerializer()
    user_has_liked = serializers.SerializerMethodField()
    user_has_saved = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    files = FileSerializer(many=True, read_only=True)
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_has_liked(request.user)
        return False
    def get_user_has_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_has_liked(request.user)
        return False    
    def get_like_count(self, obj):
        return obj.post_likes.count()
    
    def get_comment_count(self, obj):
        return obj.comments.count()  # Count the number of comments
    



    
    class Meta:
        model = Posts
        fields = '__all__'


    

class NestedCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField() 
    user = UserSerializer()
    comment_count = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_has_liked(request.user)
        return False

    def get_comment_count(self, obj):
        return obj.replies.count()  # Count the number of replies

    def get_replies(self, obj):
        
        replies = Comment.objects.filter(parent_comment=obj)
        
        reply_serializer = self.__class__(replies, many=True, context=self.context)
        return reply_serializer.data
    
    def get_like_count(self, obj):
        return obj.comment_likes.count()  
    
    class Meta:
        model = Comment
        fields = '__all__'


class CreateCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # Assuming user is a ForeignKey to the User model

    class Meta:
        model = Comment
        fields = '__all__'

class CreatePostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    files = FileSerializer(many=True, required=False)
    tags = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Posts
        fields = '__all__'

    def create(self, validated_data):
        # Extract and remove tags from the validated data
        tags_data = validated_data.pop('tags', [])
        
        # Create or retrieve existing tags
        print(tags_data)
        plaintags = json.loads(tags_data[0])
        tags = []
        for tag_data in plaintags:
            tag, created = Tag.objects.get_or_create(**tag_data)
            tags.append(tag)

        # Create the post with the remaining data
        post = super(CreatePostSerializer, self).create(validated_data)
        # Set the tags for the post
        post.tags.set(tags)
        return post
class CommentSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField() 
    user = UserSerializer()
    replies = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_has_liked(request.user)
        return False

    def get_comment_count(self, obj):
        return obj.replies.count()  # Count the number of replies

    def get_like_count(self, obj):
        return obj.comment_likes.count()

    def get_replies(self, obj):
        # If this is a reply, do not include it as a parent comment
        if obj.is_reply:
            return None
        # If this is a parent comment, include its replies
        replies = Comment.objects.filter(parent_comment=obj)
        reply_serializer = NestedCommentSerializer(replies, many=True, context=self.context)
        return reply_serializer.data

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user',)


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLikes
        fields = '__all__'        

class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLikes
        fields = '__all__'        

class PostSaveSerializer(serializers.ModelSerializer):
    post = PostSerializer()
    class Meta:
        model = PostSaves
        fields = '__all__'       

class TagSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagSaves
        fields = '__all__'        

