# Serializers
from rest_framework import serializers
from .models import *

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'

class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = '__all__'

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
