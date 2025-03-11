from django.contrib import admin
from .models import *

# Enregistrement basique
admin.site.register(Utilisateur)
admin.site.register(Cours)
admin.site.register(Seance)
admin.site.register(CoursSemestre)
admin.site.register(Inscription)
admin.site.register(NoteExamen)
admin.site.register(NoteTDTP)
admin.site.register(Exercice)
admin.site.register(Question)

