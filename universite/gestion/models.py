from django.db import models

# Modèle des étudiants
class Etudiant(models.Model):
    nom = models.CharField(max_length=25)
    prenom = models.CharField(max_length=25)
    annee = models.IntegerField()

    def __str__(self):
        return f"{self.nom} {self.prenom}"  

# Modèle des enseignants
class Enseignant(models.Model):
    FONCTIONS = [
        ('Vacataire', 'Vacataire'),
        ('ATER', 'ATER'),
        ('MdC', 'Maître de Conférences'),
        ('Professeur', 'Professeur'),
    ]
    nom = models.CharField(max_length=25)
    prenom = models.CharField(max_length=25)
    tel = models.CharField(max_length=15)
    fonction = models.CharField(max_length=20, choices=FONCTIONS)

    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.fonction})"

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
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE)
    duree = models.IntegerField()
    description = models.TextField()
    salle = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.cours.titre} - {self.salle}"

# Modèle des cours semestre
class CoursSemestre(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE)
    semestre = models.IntegerField()
    annee = models.IntegerField()

    def __str__(self):
        return f"{self.cours.titre} - Semestre {self.semestre}" 

# Modèle des inscriptions
class Inscription(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    cours_semestre = models.ForeignKey(CoursSemestre, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.etudiant.nom} inscrit à {self.cours_semestre}"

# Modèle des notes d'examen
class NoteExamen(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    type_examen = models.CharField(max_length=20)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.cours.titre} : {self.note}"

# Modèle des notes de TD/TP
class NoteTDTP(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    note = models.DecimalField(max_digits=4, decimal_places=2)
    explication = models.TextField()

    def __str__(self):
        return f"{self.etudiant.nom} - {self.seance.cours.titre} : {self.note}"

# Modèle des exercices
class Exercice(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Exercice de {self.etudiant.nom} - {self.seance.cours.titre}"

# Modèle des questions
class Question(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    contenu = models.TextField()

    def __str__(self):
        return f"Question de {self.etudiant.nom} - {self.seance.cours.titre}"
