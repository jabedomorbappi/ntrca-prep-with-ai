from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Create a custom UserAdmin class
class CustomUserAdmin(UserAdmin):
    # Specify the columns you want to see in the table view
    list_display = ('username', 'email', 'date_joined', 'last_login', 'is_staff')

# Unregister the default User configuration
admin.site.unregister(User)

# Re-register User with your new custom layout displays
admin.site.register(User, CustomUserAdmin)