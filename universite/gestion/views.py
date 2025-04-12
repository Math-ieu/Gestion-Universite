from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404 

from django.contrib.auth import get_user_model
User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer 
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            # Log l'erreur pour débogage
            logger.error(f"Erreur de validation: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
class UserListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des Users en filtrant par rôle.
    Exemple : /api/Users/?role=etudiant
    """ 
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Authentification requise

    def get_queryset(self):
        """
        Récupère les Users en fonction du rôle passé en paramètre GET.
        """
        role = self.request.query_params.get("role", None)
        queryset = User.objects.all()

        if role:
            queryset = queryset.filter(role=role)

        return queryset


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour et supprimer un User spécifique.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Recherche un User par ID et vérifie le rôle passé en paramètre GET.
        """
        role = self.request.query_params.get("role", None)
        obj = get_object_or_404(User, id=self.kwargs["pk"])

        if role and obj.role != role:
            self.permission_denied(self.request, message="Ce rôle ne correspond pas à cet User.")

        return obj


      # Autoriser tout le monde à accéder à cette vue

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# ========================
# CRUD pour Etudiant
# ========================
# ========================
# CRUD pour Enseignants
# ========================
class TeacherListCreate(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='enseignant')

    def perform_create(self, serializer):
        # Assurez-vous que le rôle est 'enseignant' lors de la création
        serializer.save(role='enseignant')

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='enseignant')

# ========================
# CRUD pour Étudiants
# ========================
class StudentListCreate(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='etudiant')

    def perform_create(self, serializer):
        # Assurez-vous que le rôle est 'etudiant' lors de la création
        serializer.save(role='etudiant')

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='etudiant')
# ========================
# CRUD pour Cours
# ========================
class CoursListCreate(generics.ListCreateAPIView):
    queryset = Cours.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CoursSerializer

class CoursDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cours.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CoursSerializer

# ========================
# CRUD pour Seance
# ========================
class SeanceListCreate(generics.ListCreateAPIView):
    queryset = Seance.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SeanceSerializer

class SeanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seance.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SeanceSerializer




# ========================
# CRUD pour Inscription
# ========================
class InscriptionListCreate(generics.ListCreateAPIView):
    queryset = Inscription.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = InscriptionSerializer

class InscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inscription.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = InscriptionSerializer

# ========================
# CRUD pour NoteExamen
# ========================
class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

# ========================
# CRUD pour NoteTDTP
# ========================


# ========================
# CRUD pour Exercice
# ========================
class ExerciceListCreate(generics.ListCreateAPIView):
    queryset = Exercice.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciceSerializer

class ExerciceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercice.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ExerciceSerializer

# ========================
# CRUD pour Question
# ========================
class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    

# CRUD pour SoumissionExercice
class SoumissionExerciceListCreate(generics.ListCreateAPIView):
    queryset = SoumissionExercice.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SoumissionExerciceSerializer

class SoumissionExerciceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SoumissionExercice.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SoumissionExerciceSerializer
