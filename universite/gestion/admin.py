from django.contrib import admin
from .models import *

# Enregistrement basique
admin.site.register(User)
admin.site.register(Seance)
admin.site.register(Cours)
admin.site.register(Inscription)
admin.site.register(SoumissionExercice)
admin.site.register(Note)
admin.site.register(Exercice)
admin.site.register(Question)

