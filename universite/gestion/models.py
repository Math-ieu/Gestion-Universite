from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# --------------------------- #
#  MANAGER POUR LES UTILISATEURS
# --------------------------- #
class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, role="etudiant", **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# --------------------------- #
#  MODÈLE UTILISATEUR DE BASE
# --------------------------- #
class Utilisateur(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('secretaire', 'Secrétaire'),
        ('enseignant', 'Enseignant'),
    ]
    
    nom = models.CharField(max_length= 100, blank=True, null=True)
    prenom = models.CharField(max_length= 100, blank=True, null=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="etudiant")
    annee = models.IntegerField(blank=True, null=True)
    tel = models.CharField(max_length= 20,blank=True, null=True)
    fonction = models.CharField(max_length=50, blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Modifié dynamiquement
    
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    objects = UtilisateurManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        """ Active automatiquement `is_staff` pour les secrétaires. """
        if self.role == "secretaire":
            self.is_staff = True
        else:
            self.is_staff = False
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
    enseignant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'enseignant'})
    duree = models.IntegerField()
    description = models.TextField()
    salle = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.cours.titre} - {self.salle}"

# Modèle des cours semestre
class CoursSemestre(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    enseignant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'enseignant'})
    semestre = models.IntegerField()
    annee = models.IntegerField()

    def __str__(self):
        return f"{self.cours.titre} - Semestre {self.semestre}" 

# Modèle des inscriptions
class Inscription(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours_semestre = models.ForeignKey(CoursSemestre, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.nom} inscrit à {self.cours_semestre}"

# Modèle des notes d'examen
class NoteExamen(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    type_examen = models.CharField(max_length=20)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.cours.titre} : {self.note}"

# Modèle des notes de TD/TP
class NoteTDTP(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.seance.cours.titre} : {self.note}"

# Modèle des exercices
class Exercice(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Exercice de {self.etudiant.nom} - {self.seance.cours.titre}"

# Modèle des questions
class Question(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Question de {self.etudiant.nom} - {self.seance.cours.titre}"
    

class SoumissionExercice(models.Model):
    etudiant = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, limit_choices_to={'role': 'etudiant'})
    exercice = models.ForeignKey("Exercice", on_delete=models.CASCADE)
    fichier = models.FileField(upload_to="soumissions/")
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soumission de {self.etudiant} pour {self.exercice}"