from .models import User, UserSaves
from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from DashboardApp.models import Posts,PostLikes, CommentLikes, Comment


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required = True)
    first_name =serializers.CharField(required= True)
    last_name = serializers.CharField(required = True)

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()
        return {
            'fist_name': self.validated_data.get('first_name',''),
            'last_name': self.validated_data.get('last_name',''),
            'email': self.validated_data.get('email',''),
            'username': self.validated_data.get('username','')
            }
    
    def save(self, request):
        user = User.objects.create_user(
            username = self.validated_data['username'],
            email=self.validated_data['email'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
        )
        return user
    


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')
        read_only_fields = ('email',)


class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField()
    posts_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    total_like_count = serializers.SerializerMethodField()
    def get_posts_count(self, obj):
        return Posts.objects.filter(user=obj).count()

    def get_comments_count(self, obj):
        return Comment.objects.filter(user=obj).count()
    def get_total_like_count(self, obj):
        return PostLikes.objects.filter(post__user=obj).count() + CommentLikes.objects.filter(comment__user=obj).count()
    class Meta:
        model = User
        exclude = ['password']

    
class UserSaveSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    user_saved= UserSerializer()
    class Meta:
        model = UserSaves
        fields = '__all__'
class CRUDserSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSaves
        fields = '__all__'        