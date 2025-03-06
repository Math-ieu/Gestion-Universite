from django.urls import path
from .views import (
    EtudiantListCreate, EtudiantDetail, EnseignantListCreate, EnseignantDetail, 
    CoursListCreate, CoursDetail, SeanceListCreate, SeanceDetail, 
    CoursSemestreListCreate, CoursSemestreDetail, InscriptionListCreate, 
    InscriptionDetail, NoteExamenListCreate, NoteExamenDetail, NoteTDTPListCreate, 
    NoteTDTPDetail, ExerciceListCreate, ExerciceDetail, QuestionListCreate, QuestionDetail
)

urlpatterns = [
    path('etudiants/', EtudiantListCreate.as_view(), name='etudiants-list'),
    path('etudiants/<int:pk>/', EtudiantDetail.as_view(), name='etudiant-detail'),
    
    path('enseignants/', EnseignantListCreate.as_view(), name='enseignants-list'),
    path('enseignants/<int:pk>/', EnseignantDetail.as_view(), name='enseignant-detail'),
    
    path('cours/', CoursListCreate.as_view(), name='cours-list'),
    path('cours/<int:pk>/', CoursDetail.as_view(), name='cours-detail'),

    path('seances/', SeanceListCreate.as_view(), name='seances-list'),
    path('seances/<int:pk>/', SeanceDetail.as_view(), name='seance-detail'),

    path('cours-semestres/', CoursSemestreListCreate.as_view(), name='cours-semestres-list'),
    path('cours-semestres/<int:pk>/', CoursSemestreDetail.as_view(), name='cours-semestre-detail'),

    path('inscriptions/', InscriptionListCreate.as_view(), name='inscriptions-list'),
    path('inscriptions/<int:pk>/', InscriptionDetail.as_view(), name='inscription-detail'),

    path('notes-examens/', NoteExamenListCreate.as_view(), name='notes-examens-list'),
    path('notes-examens/<int:pk>/', NoteExamenDetail.as_view(), name='note-examen-detail'),

    path('notes-tdtp/', NoteTDTPListCreate.as_view(), name='notes-tdtp-list'),
    path('notes-tdtp/<int:pk>/', NoteTDTPDetail.as_view(), name='note-tdtp-detail'),

    path('exercices/', ExerciceListCreate.as_view(), name='exercices-list'),
    path('exercices/<int:pk>/', ExerciceDetail.as_view(), name='exercice-detail'),

    path('questions/', QuestionListCreate.as_view(), name='questions-list'),
    path('questions/<int:pk>/', QuestionDetail.as_view(), name='question-detail'),
]
