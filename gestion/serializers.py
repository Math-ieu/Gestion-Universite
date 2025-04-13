# Serializers
from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
import logging
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, min_length=6)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'password2',
            'nom',
            'prenom',
            'role',
            'tel',
            'fonction',
            'filiere',
            'anneeetude',
            'anneeinscrit',
            'datedenaissance'
        )

        extra_kwargs = {
            # CharField
            'nom': {'required': False, 'allow_blank': True},
            # CharField
            'prenom': {'required': False, 'allow_blank': True},
            # CharField
            'tel': {'required': False, 'allow_blank': True},
            # CharField
            'fonction': {'required': False, 'allow_blank': True},

            # DateField
            'anneeinscrit': {'required': False, 'allow_null': True},
            # DateField
            'datedenaissance': {'required': False, 'allow_null': True},

            # ForeignKey ou IntegerField ?
            'filiere': {'required': False, 'allow_null': True},
            # IntegerField ?
            'anneeetude': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )

        # Vérifier que l'email n'existe pas déjà
        email = attrs['email']
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "Un User avec cet email existe déjà."}
            )

        # Si l'User est un étudiant, l'année devrait être renseignée
        if attrs.get('role') == 'etudiant' and not attrs.get('annee'):
            raise serializers.ValidationError(
                {"annee": "L'année est requise pour les étudiants."}
            )

        # Si l'User est un enseignant, la fonction devrait être renseignée
        if attrs.get('role') == 'enseignant' and not attrs.get('fonction'):
            raise serializers.ValidationError(
                {"fonction": "La fonction est requise pour les enseignants."}
            )

        return attrs

    def create(self, validated_data):
        # Supprimer password2 des données validées
        validated_data.pop('password2')

        # Récupérer le mot de passe
        password = validated_data.pop('password')

        # Créer l'User sans le mot de passe
        user = User.objects.create(**validated_data)

        # Définir le mot de passe avec la méthode sécurisée
        user.set_password(password)
        user.save()

        return user


logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'nom', 'prenom', 'tel', 'role', 
                  'anneeinscrit', 'fonction', 'filiere', 'anneeetude', 
                  'datedenaissance', 'is_active', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        # Hash du mot de passe avant de créer l'utilisateur
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Hash du mot de passe si présent dans les données de mise à jour
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().update(instance, validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.EmailField()
        self.fields.pop('username', None)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Ajout d'infos personnalisées au token JWT
        token['role'] = user.role
        token['email'] = user.email
        token['nom'] = user.nom
        token['prenom'] = user.prenom
        return token

    def validate(self, attrs):
        # Récupérer email et password
        email = attrs.get('email')
        password = attrs.get('password')

        # Log pour déboguer
        logger.debug(f"Tentative de connexion: email={email}")

        if email and password:
            from .models import User

            try:
                user = User.objects.get(email=email)
                logger.debug(f"User trouvé: {user.email}")

                if not user.check_password(password):
                    raise serializers.ValidationError(
                        {"detail": "Mot de passe incorrect."}
                    )

            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"detail": f"Aucun compte trouvé avec l'email: {email}"}
                )
            except Exception as e:
                logger.error(f"Erreur d'authentification: {str(e)}")
                raise serializers.ValidationError(
                    {"detail": f"Erreur de connexion: {str(e)}"}
                )
        else:
            raise serializers.ValidationError(
                {"detail": "Email et mot de passe sont requis."}
            )

        # Obtenir le token JWT
        refresh = self.get_token(user)

        # Construire la réponse
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'nom': user.nom,
                'prenom': user.prenom
            }
        }

        return data


class CoursSerializer(serializers.ModelSerializer):
    enseignant_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Cours
        fields = ['titre', 'description', 'volumehoraire', 'type_cours', 
                  'semestre', 'anneeetude', 'enseignant', 'enseignant_id']
        read_only_fields = ['enseignant']
    
    def create(self, validated_data):
        enseignant_id = validated_data.pop('enseignant_id')
        enseignant = User.objects.get(id=enseignant_id, role='enseignant')
        cours = Cours.objects.create(enseignant=enseignant, **validated_data)
        return cours


class SeanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seance
        fields = '__all__'


class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscription
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
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
