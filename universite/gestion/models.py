from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

from django.contrib.auth.base_user import BaseUserManager


# --------------------------- #
#  MANAGER POUR LES UserS
# --------------------------- #


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superuser doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superuser doit avoir is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)
    

class User(AbstractUser):
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('secretaire', 'Secrétaire'),
        ('enseignant', 'Enseignant'),
    ]
    # Champ d'authentification
    username = None  # Supprime le champ username
    email = models.EmailField(unique=True)
 
    # Champs de profil
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    tel = models.CharField(max_length=20, blank=True, null=True)

    # Champs spécifiques aux rôles
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default="etudiant")
    annee = models.IntegerField(blank=True, null=True)  # Pour étudiant
    # Pour enseignant/secrétaire
    fonction = models.CharField(max_length=50, blank=True, null=True)

    # Modification des related_name pour éviter les conflits
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']
    
    # Utilisez le gestionnaire personnalisé
    objects = UserManager()


    def __str__(self):
        if self.nom and self.prenom:
            return f"{self.prenom} {self.nom}"
        return self.email

    @property
    def full_name(self):

        return f"{self.prenom} {self.nom}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def is_etudiant(self):
        return self.role == "etudiant"

    def is_secretaire(self):
        return self.role == "secretaire"

    def is_enseignant(self):
        return self.role == "enseignant"
# --------------------------- #
#  MODÈLES SPÉCIFIQUES
# --------------------------- #


# Modèle des cours
class Cours(models.Model):
    TYPES_COURS = [
        ('CM', 'Cours Magistral'),
        ('TP', 'Travaux Pratiques'),
        ('TD', 'Travaux Dirigés'),
    ]
    titre = models.CharField(max_length=50)
    description = models.TextField()
    heures = models.IntegerField()
    type_cours = models.CharField(max_length=2, choices=TYPES_COURS)

    def __str__(self):
        return self.titre

# Modèle des séances


class Seance(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    enseignant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'enseignant'})
    duree = models.IntegerField()
    description = models.TextField()
    salle = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.cours.titre} - {self.salle}"

# Modèle des cours semestre


class CoursSemestre(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    enseignant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'enseignant'})
    semestre = models.IntegerField()
    annee = models.IntegerField()

    def __str__(self):
        return f"{self.cours.titre} - Semestre {self.semestre}"

# Modèle des inscriptions


class Inscription(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours_semestre = models.ForeignKey(CoursSemestre, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.nom} inscrit à {self.cours_semestre}"

# Modèle des notes d'examen


class NoteExamen(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    type_examen = models.CharField(max_length=20)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.cours.titre} : {self.note}"

# Modèle des notes de TD/TP


class NoteTDTP(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.seance.cours.titre} : {self.note}"

# Modèle des exercices


class Exercice(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Exercice de {self.etudiant.nom} - {self.seance.cours.titre}"

# Modèle des questions


class Question(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Question de {self.etudiant.nom} - {self.seance.cours.titre}"


class SoumissionExercice(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    exercice = models.ForeignKey("Exercice", on_delete=models.CASCADE)
    fichier = models.FileField(upload_to="soumissions/")
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soumission de {self.etudiant} pour {self.exercice}"
