from django.shortcuts import render
from UserApp.models import User
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import generics,status
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework import mixins
from rest_auth.registration.views import RegisterView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Posts, Comment, Tag, PostLikes
from django.db import models
from rest_framework.parsers import MultiPartParser, FileUploadParser



class FileUploadView(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes =[JWTAuthentication]
    permission_classes = [AllowAny]
    parser_class = (FileUploadParser,)
    serializer_class = FileSerializer
    queryset = File.objects.all()
    # def filter_queryset(self,request):
    #     return File.objects.all()
    # def get_queryset(self):
    #     return File.objects.all()
    def get(self, request):
        return self.list(request)
    def post(self, request, *args, **kwargs):
      file_serializer = FileSerializer(data=request.data)
      if file_serializer.is_valid():
          file_serializer.save()
          return Response(file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenericPostAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]  # You can restrict access as needed

    serializer_class = PostSerializer
    queryset = Posts.objects.all()
    lookup_field = 'id'
    def get(self, request):
        id_param = request.query_params.get('id')
        
        if id_param:
            # If id parameter is provided, filter the queryset and retrieve the specific item
            item = self.queryset.filter(id=id_param).first()
            if item:
                serializer = self.get_serializer(item)
                return Response(serializer.data)
            else:
                return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            
            return self.list(request)

        
    def post(self, request):
        return self.create(request)
    
    def put(self, request, id=None):
        return self.update(request, id)
    def patch(self, request, id=None):
        return self.partial_update(request, id)
    def delete(self, request, id):
        return self.destroy(request, id)
    

class GenericPostLikeAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    serializer_class = PostLikeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed

    queryset = PostLikes.objects.all()
    lookup_field = 'id'
    def get(self,request, id=None):
        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
        
    def post(self, request, id):
        request.data['post'] = id
        request.data['user'] = request.user.id
        return self.create(request)
    
    def delete(self, request, id):
        post_id = id

        # Get the authenticated user
        user = request.user

        # Find and delete the like associated with the user and post_id
        try:
            post_like = PostLikes.objects.get(user=user, post=post_id)
            self.perform_destroy(post_like)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PostLikes.DoesNotExist:
            return Response({"detail": "PostLike not found"}, status=status.HTTP_404_NOT_FOUND)

class GenericCommentLikeAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    serializer_class = CommentLikeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed

    queryset = CommentLikes.objects.all()
    lookup_field = 'id'
    def get(self,request, id=None):
        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
        
    def post(self, request, id):
        request.data['comment'] = id
        request.data['user'] = request.user.id
        return self.create(request)
    
    def delete(self, request, id):
        post_id = id

        # Get the authenticated user
        user = request.user

        # Find and delete the like associated with the user and post_id
        try:
            comment_like = CommentLikes.objects.get(user=user, comment=post_id)
            self.perform_destroy(comment_like)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CommentLikes.DoesNotExist:
            return Response({"detail": "CommentLike not found"}, status=status.HTTP_404_NOT_FOUND)
       
    
class CommentListView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = CreateCommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    def perform_create(self, serializer):
        # Set the user field to the authenticated user from the request
        serializer.save(user=self.request.user)
    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class CommentDetailView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication,]
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id)

    def put(self, request, id):
        return self.update(request, id)

    def patch(self, request, id):
        return self.partial_update(request, id)

    def delete(self, request, id):
        comment_id = id
        user = request.user

        try:
            comment = Comment.objects.get(user=user, id=comment_id)
            self.perform_destroy(comment)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"detail": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

class TopLikedPostsView(ListAPIView):
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed

    def get_queryset(self):
        return Posts.objects.annotate(like_count=models.Count('post_likes')).order_by('-like_count')[:10]

class TopLikedCommentsForPostView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')  # Get the post ID from URL parameter
        return Comment.objects.filter(parent_post_id=post_id, is_reply=False).annotate(like_count=models.Count('comment_likes')).order_by('-like_count')[:10]

class TopLikedCommentsView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.annotate(like_count=models.Count('comment_likes')).order_by('-like_count')[:10]

class MostPopularTagsView(ListAPIView):
    queryset = Tag.objects.annotate(total_posts=models.Count('posts')).order_by('-total_posts')
    serializer_class = TagSerializer

class CommentCreateView(generics.CreateAPIView):
    serializer_class = CreateCommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Set the user field to the authenticated user from the request
        serializer.save(user=self.request.user)

class PostCreateView(APIView):
    parser_classes = (MultiPartParser, FileUploadParser)
    serializer_class = CreatePostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    
    def post(self, request):
        print(request.data)
        serializer = CreatePostSerializer(data=request.data)
        #if request.data['files']:

        if serializer.is_valid():
            # Automatically set the user from the request's authentication
            serializer.validated_data['user'] = request.user
            serializer.validated_data['files'] = request.data['files']
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class SearchView(APIView):
    def get(self,request):
        query = request.query_params.get('search','')
        responseData = {}
        resultsUserUserName = User.objects.filter(username__icontains=query)[:3]
        resultsUserfirst_name = User.objects.filter(first_name__icontains=query,)[:3]    
        
        if resultsUserUserName.exists() or resultsUserfirst_name.exists():
            responseData['users'] = {} 
            if resultsUserUserName.exists():
                serializerUserUserName = UserSerializer(resultsUserUserName, many=True).data
                responseData['users']['username']=serializerUserUserName
            if resultsUserfirst_name.exists():
                serializerUserfirst_name = UserSerializer(resultsUserfirst_name, many=True).data
                responseData['users']['first_name']=serializerUserfirst_name       

        resultsPostTitle = Posts.objects.filter(title__icontains=query)[:3]
        resultsPosttext = Posts.objects.filter(text__icontains=query)[:3]

        if resultsPostTitle.exists() or resultsPosttext.exists():    
            responseData['posts'] = {} 
            if resultsPostTitle.exists():
                serializerPostTitle = PostSerializer(resultsPostTitle, many=True).data
                responseData['posts']['title']= serializerPostTitle
            if resultsPosttext.exists():
                serializerPosttext = PostSerializer(resultsPosttext, many=True).data
                responseData['posts']['text']=serializerPosttext        
        

        return Response(responseData)