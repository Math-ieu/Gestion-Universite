# Serializers
from rest_framework import serializers
from .models import *


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nom = serializers.CharField(required=False, allow_blank=True)
    prenom = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=["etudiant", "secretaire", "enseignant"])
    annee = serializers.IntegerField(required=False)
    tel = serializers.CharField(required=False, allow_blank=True)
    fonction = serializers.CharField(required=False, allow_blank=True)
    

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'nom', 'prenom', 'email', 'role', 'annee', 'tel', 'fonction']

class CoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cours
        fields = '__all__'

class SeanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seance
        fields = '__all__'

class CoursSemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoursSemestre
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscription
        fields = '__all__'

class NoteExamenSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteExamen
        fields = '__all__'

class NoteTDTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteTDTP
        fields = '__all__'

class ExerciceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercice
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class SoumissionExerciceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoumissionExercice
        fields = '__all__'