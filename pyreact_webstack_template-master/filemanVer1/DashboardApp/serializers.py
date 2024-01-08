from rest_framework_bulk import (BulkListSerializer,BulkSerializerMixin,)
from .models import Posts, Comment, Tag, PostLikes, CommentLikes,File
from rest_framework import serializers
from UserApp.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

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
    tags = TagSerializer()
    files = FileSerializer(many=True, read_only=True)
    
    def get_user_has_liked(self, obj):
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

    class Meta:
        model = Posts
        fields = '__all__'

    def create(self, validated_data):
        # Handle file data separately if provided
        files_data = validated_data.pop('files', [])
        print('test')
        post_instance = super(CreatePostSerializer, self).create(validated_data)

        # Process and create files associated with the post
        for file_data in files_data:
            # Assuming File model is used for handling files
            File.objects.create(post=post_instance, **file_data)

        return post_instance

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

