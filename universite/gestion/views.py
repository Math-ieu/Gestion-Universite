from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import *
from .serializers import *

# ========================
# CRUD pour Etudiant
# ========================
class EtudiantListCreate(generics.ListCreateAPIView):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

class EtudiantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

# ========================
# CRUD pour Enseignant
# ========================
class EnseignantListCreate(generics.ListCreateAPIView):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer

class EnseignantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer

# ========================
# CRUD pour Cours
# ========================
class CoursListCreate(generics.ListCreateAPIView):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer

class CoursDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer

# ========================
# CRUD pour Seance
# ========================
class SeanceListCreate(generics.ListCreateAPIView):
    queryset = Seance.objects.all()
    serializer_class = SeanceSerializer

class SeanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seance.objects.all()
    serializer_class = SeanceSerializer

# ========================
# CRUD pour CoursSemestre
# ========================
class CoursSemestreListCreate(generics.ListCreateAPIView):
    queryset = CoursSemestre.objects.all()
    serializer_class = CoursSemestreSerializer

class CoursSemestreDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CoursSemestre.objects.all()
    serializer_class = CoursSemestreSerializer

# ========================
# CRUD pour Inscription
# ========================
class InscriptionListCreate(generics.ListCreateAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer

class InscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer

# ========================
# CRUD pour NoteExamen
# ========================
class NoteExamenListCreate(generics.ListCreateAPIView):
    queryset = NoteExamen.objects.all()
    serializer_class = NoteExamenSerializer

class NoteExamenDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoteExamen.objects.all()
    serializer_class = NoteExamenSerializer

# ========================
# CRUD pour NoteTDTP
# ========================
class NoteTDTPListCreate(generics.ListCreateAPIView):
    queryset = NoteTDTP.objects.all()
    serializer_class = NoteTDTPSerializer

class NoteTDTPDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoteTDTP.objects.all()
    serializer_class = NoteTDTPSerializer

# ========================
# CRUD pour Exercice
# ========================
class ExerciceListCreate(generics.ListCreateAPIView):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer

class ExerciceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer

# ========================
# CRUD pour Question
# ========================
class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
