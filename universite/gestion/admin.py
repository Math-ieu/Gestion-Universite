from django.contrib import admin
from .models import (
    Etudiant, Enseignant, Cours, Seance, 
    CoursSemestre, Inscription, NoteExamen, 
    NoteTDTP, Exercice, Question
)

# Enregistrement basique
admin.site.register(Etudiant)
admin.site.register(Enseignant)
admin.site.register(Cours)
admin.site.register(Seance)
admin.site.register(CoursSemestre)
admin.site.register(Inscription)
admin.site.register(NoteExamen)
admin.site.register(NoteTDTP)
admin.site.register(Exercice)
admin.site.register(Question)

