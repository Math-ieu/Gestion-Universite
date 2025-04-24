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
        validated_data['password'] = make_password(
            validated_data.get('password'))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Hash du mot de passe si présent dans les données de mise à jour
        if 'password' in validated_data:
            validated_data['password'] = make_password(
                validated_data.get('password'))
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
        token['id'] = user.id
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
                'email': user.email,
                'role': user.role,
                'nom': user.nom,
                'prenom': user.prenom,
                'id': user.id
            }
        }

        return data


class CoursSerializer(serializers.ModelSerializer):
    enseignant_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Cours
        fields = ['id', 'titre', 'description', 'volumehoraire', 'type_cours',
                  'semestre', 'anneeetude', 'enseignant', 'enseignant_id']
        read_only_fields = ['enseignant']

    def create(self, validated_data):
        enseignant_id = validated_data.pop('enseignant_id')
        enseignant = User.objects.get(id=enseignant_id, role='enseignant')
        cours = Cours.objects.create(enseignant=enseignant, **validated_data)
        return cours

    


class SeanceSerializer(serializers.ModelSerializer):
    cours_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Seance
        fields = ['id', 'cours', 'cours_id',
                  'duree', 'date', 'heure_debut', 'salle']
        read_only_fields = ['cours']

    def create(self, validated_data):
        cours_id = validated_data.pop('cours_id')
        cours = Cours.objects.get(id=cours_id)
        seance = Seance.objects.create(cours=cours, **validated_data)
        return seance


class InscriptionSerializer(serializers.ModelSerializer):
    etudiant = UserSerializer(read_only=True)
    cours = CoursSerializer(read_only=True)
    etudiant_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='etudiant', write_only=True
    )
    cours_id = serializers.PrimaryKeyRelatedField(
        queryset=Cours.objects.all(), source='cours', write_only=True
    )

    class Meta:
        model = Inscription
        fields = ['id', 'etudiant', 'cours', 'etudiant_id', 'cours_id']

    def create(self, validated_data):
        # Créer une inscription avec la clé composite
        return Inscription.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Mettre à jour les champs si nécessaire
        instance.etudiant = validated_data.get('etudiant', instance.etudiant)
        instance.cours = validated_data.get('cours', instance.cours)
        instance.save()
        return instance

    def validate(self, data):
        # Vérifier que la combinaison etudiant/cours n'existe pas déjà
        etudiant = data.get('etudiant')
        cours = data.get('cours')
        if self.instance is None:  # Création
            if Inscription.objects.filter(etudiant=etudiant, cours=cours).exists():
                raise serializers.ValidationError(
                    "Cet étudiant est déjà inscrit à ce cours."
                )
        else:  # Mise à jour
            if (
                Inscription.objects.filter(etudiant=etudiant, cours=cours)
                .exclude(etudiant=self.instance.etudiant, cours=self.instance.cours)
                .exists()
            ):
                raise serializers.ValidationError(
                    "Cet étudiant est déjà inscrit à ce cours."
                )
        return data
 
class NoteSerializer(serializers.ModelSerializer):
    etudiant_id = serializers.IntegerField(write_only=True)
    cours_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Note
        fields = ['id', 'etudiant', 'etudiant_id', 'cours', 'cours_id',
                  'type_examen', 'note', 'explication']
        read_only_fields = ['etudiant', 'cours']

    def create(self, validated_data):
        etudiant_id = validated_data.pop('etudiant_id')
        cours_id = validated_data.pop('cours_id')
        etudiant = User.objects.get(id=etudiant_id, role='etudiant')
        cours = Cours.objects.get(id=cours_id)
        note = Note.objects.create(
            etudiant=etudiant,
            cours=cours,
            **validated_data
        )
        return note

    def validate(self, attrs):
        # Validation de la note (entre 0 et 20)
        note = attrs.get('note')
        if note is not None and (note < 0 or note > 20):
            raise serializers.ValidationError(
                {"note": "La note doit être comprise entre 0 et 20."})
        return attrs


class ExerciceSerializer(serializers.ModelSerializer):
    cours_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Exercice
        fields = ['id', 'cours', 'cours_id', 'description', 'titre_exercice',
                  'date_limite', 'type_exercice']
        read_only_fields = ['cours']

    def create(self, validated_data):
        cours_id = validated_data.pop('cours_id')
        cours = Cours.objects.get(id=cours_id)
        exercice = Exercice.objects.create(cours=cours, **validated_data)
        return exercice


class QuestionSerializer(serializers.ModelSerializer):
    etudiant_id = serializers.IntegerField(write_only=True)
    seance_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Question
        fields = ['id', 'etudiant', 'etudiant_id',
                  'seance', 'seance_id', 'contenu']
        read_only_fields = ['etudiant', 'seance']

    def create(self, validated_data):
        etudiant_id = validated_data.pop('etudiant_id')
        seance_id = validated_data.pop('seance_id')
        etudiant = User.objects.get(id=etudiant_id, role='etudiant')
        seance = Seance.objects.get(id=seance_id)
        question = Question.objects.create(
            etudiant=etudiant,
            seance=seance,
            **validated_data
        )
        return question


class SoumissionExerciceSerializer(serializers.ModelSerializer):
    etudiant_id = serializers.IntegerField(write_only=True)
    exercice_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SoumissionExercice
        fields = ['id', 'etudiant', 'etudiant_id', 'exercice', 'exercice_id',
                  'fichier', 'date_soumission']
        read_only_fields = ['etudiant', 'exercice', 'date_soumission']

    def create(self, validated_data):
        etudiant_id = validated_data.pop('etudiant_id')
        exercice_id = validated_data.pop('exercice_id')
        etudiant = User.objects.get(id=etudiant_id, role='etudiant')
        exercice = Exercice.objects.get(id=exercice_id)
        soumission = SoumissionExercice.objects.create(
            etudiant=etudiant,
            exercice=exercice,
            **validated_data
        )
        return soumission
