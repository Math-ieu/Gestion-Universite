from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView, 
)
  
urlpatterns = [ 
     
     # Liste et création
    path("utilisateurs/", UserListCreateView.as_view(), name="utilisateur-list-create"),
    # Détail, mise à jour et suppression
    path("utilisateurs/<int:pk>/", UserRetrieveUpdateDestroyView.as_view(), name="utilisateur-detail"),
    

    path('seances/', SeanceListCreate.as_view(), name='seances-list'),
    path('seances/<int:pk>/', SeanceDetail.as_view(), name='seance-detail'),

    # Enseignants
    path('teachers/', TeacherListCreate.as_view(), name='teacher-list-create'),
    path('teachers/<int:pk>/', TeacherDetail.as_view(), name='teacher-detail'),

    # Étudiants
    path('students/', StudentListCreate.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentDetail.as_view(), name='student-detail'),

    # Cours (déjà couverts par vos vues existantes)
    path('courses/', CoursListCreate.as_view(), name='cours-list-create'),
    path('courses/<int:pk>/', CoursDetail.as_view(), name='cours-detail'),
    path('inscriptions/', InscriptionListCreate.as_view(), name='inscriptions-list'),
    path('inscriptions/<int:pk>/', InscriptionDetail.as_view(), name='inscription-detail'),

    path('notes/', NoteListCreate.as_view(), name='notes-examens-list'),
    path('notes/<int:pk>/', NoteDetail.as_view(), name='note-examen-detail'),

    path('notes-tdtp/', NoteListCreate.as_view(), name='notes-tdtp-list'),
    path('notes-tdtp/<int:pk>/', NoteDetail.as_view(), name='note-tdtp-detail'),

    path('exercices/', ExerciceListCreate.as_view(), name='exercices-list'),
    path('exercices/<int:pk>/', ExerciceDetail.as_view(), name='exercice-detail'),

    path('questions/', QuestionListCreate.as_view(), name='questions-list'),
    path('questions/<int:pk>/', QuestionDetail.as_view(), name='question-detail'),
    
    path('soumissions-exercices/', SoumissionExerciceListCreate.as_view(), name='soumissions-exercices-list'),
    path('soumissions-exercices/<int:pk>/', SoumissionExerciceDetail.as_view(), name='soumission-exercice-detail'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]
