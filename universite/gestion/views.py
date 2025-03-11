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


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            
            if Utilisateur.objects.filter(email=email).exists():
                return Response({"error": "Email déjà utilisé"}, status=status.HTTP_400_BAD_REQUEST)

            user = Utilisateur.objects.create(**serializer.validated_data)
            
            return Response({"message": "Utilisateur créé avec succès.", "user": {"email": user.email, "role": user.role}}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UtilisateurListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des utilisateurs en filtrant par rôle.
    Exemple : /api/utilisateurs/?role=etudiant
    """
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]  # Authentification requise

    def get_queryset(self):
        """
        Récupère les utilisateurs en fonction du rôle passé en paramètre GET.
        """
        role = self.request.query_params.get("role", None)
        queryset = Utilisateur.objects.all()

        if role:
            queryset = queryset.filter(role=role)

        return queryset


class UtilisateurRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour et supprimer un utilisateur spécifique.
    """
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Recherche un utilisateur par ID et vérifie le rôle passé en paramètre GET.
        """
        role = self.request.query_params.get("role", None)
        obj = get_object_or_404(Utilisateur, id=self.kwargs["pk"])

        if role and obj.role != role:
            self.permission_denied(self.request, message="Ce rôle ne correspond pas à cet utilisateur.")

        return obj

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = Utilisateur.objects.get(email=request.data["email"])
        response.data["role"] = user.role
        return response

class UtilisateurListCreate(generics.ListCreateAPIView):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

class UtilisateurDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

# ========================
# CRUD pour Etudiant
# ========================

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
# CRUD pour CoursSemestre
# ========================
class CoursSemestreListCreate(generics.ListCreateAPIView):
    queryset = CoursSemestre.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CoursSemestreSerializer

class CoursSemestreDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CoursSemestre.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CoursSemestreSerializer

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
class NoteExamenListCreate(generics.ListCreateAPIView):
    queryset = NoteExamen.objects.all()
    serializer_class = NoteExamenSerializer
    permission_classes = [IsAuthenticated]

class NoteExamenDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoteExamen.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NoteExamenSerializer

# ========================
# CRUD pour NoteTDTP
# ========================
class NoteTDTPListCreate(generics.ListCreateAPIView):
    queryset = NoteTDTP.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NoteTDTPSerializer

class NoteTDTPDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoteTDTP.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NoteTDTPSerializer

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
