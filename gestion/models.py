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
        
        # Si le rôle est "secretaire", définir automatiquement les autorisations
        if extra_fields.get('role') == 'secretaire':
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('is_active', True)
        
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
        max_length=20, choices=ROLE_CHOICES, default="secretaire")
    anneeinscrit = models.CharField(max_length=4, blank=True, null=True)  # Pour étudiant
    
    # Pour enseignant/secrétaire
    fonction = models.CharField(max_length=50, blank=True, null=True)
    
    filiere = models.CharField(max_length=50, blank=True, null=True)  # Pour étudiant
    anneeetude = models.CharField(max_length=4, blank=True, null=True) 
    
    datedenaissance = models.DateField(blank=True, null=True)  # Pour étudiant
    # Pour étudiant

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
        # Définir automatiquement les secrétaires comme superuser et staff
        if self.role == 'secretaire':
            self.is_staff = True
            self.is_superuser = True
            self.is_active = True
        
        super().save(*args, **kwargs)

    def is_etudiant(self):
        return self.role == "etudiant"

    def is_secretaire(self):
        return self.role == "secretaire"

    def is_enseignant(self):
        return self.role == "enseignant"
    
#  MODÈLES SPÉCIFIQUES
# --------------------------- #


# Modèle des cours
class Cours(models.Model):
    
    titre = models.CharField(max_length=50)
    description = models.TextField()
    volumehoraire = models.DecimalField(max_digits=4, decimal_places=2)
    type_cours = models.CharField(max_length=20)
    semestre = models.CharField(max_length=10) 
    anneeetude = models.CharField(max_length=20)
    enseignant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'enseignant'})
    
    def __str__(self):
        return self.titre

# Modèle des séances
class Seance(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    duree = models.IntegerField()
    date = models.DateField()
    heure_debut = models.TimeField()
    salle = models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.cours.titre} - {self.salle}"

# Modèle des cours semestre


# Modèle des inscriptions

class Inscription(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.nom} inscrit à {self.cours.titre}"

# Modèle des notes d'examen


class Note(models.Model):
    etudiant = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    type_examen = models.CharField(max_length=20)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.cours.titre} : {self.note}"

class Exercice(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    description = models.TextField()
    titre_exercice = models.CharField(max_length=50)
    date_limite = models.DateTimeField()
    type_exercice = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.cours.titre}"

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
    exercice = models.ForeignKey(Exercice, on_delete=models.CASCADE)
    fichier = models.FileField(upload_to="soumissions/")
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soumission de {self.etudiant} pour {self.exercice}"
