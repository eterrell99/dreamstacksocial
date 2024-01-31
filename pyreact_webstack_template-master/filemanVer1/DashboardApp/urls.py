from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework import routers
app_name= 'DashboardApp'
router = routers.SimpleRouter()

urlpatterns = [   
   path('post/', GenericPostAPIView.as_view()), 
   path('post/user/<int:id>/', PostsByUserView.as_view()),                                                                                
   path('comment/<int:id>/', CommentDetailView.as_view()),
   path('comment/', CommentListView.as_view()),
   path('post/top/', TopLikedPostsView.as_view(), name='top-liked-posts'),
   path('comment/top/', TopLikedCommentsView.as_view(), name='top-liked-comments'),
   path('comment/top/<int:post_id>/', TopLikedCommentsForPostView.as_view(), name='top-liked-comments-for-post'),
    path('tag/top/', MostPopularTagsView.as_view(), name='most-popular-tags'),
    path('post/<int:id>/like/', GenericPostLikeAPIView.as_view(), name='PostLikeAPIView'),
    path('comment/<int:id>/like/',GenericCommentLikeAPIView.as_view(), name='CommentLikeAPIView'),
    path('comment/create/', CommentCreateView.as_view(), name='commentCreate'),
    path('post/create/', PostCreateView.as_view(), name="post-create"),
    path('files/', FileUploadView.as_view()),
    path('search/', SearchView.as_view()),
    path('', include(router.urls)),
   ]