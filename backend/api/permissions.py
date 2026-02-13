from rest_framework import permissions

class IsMonitor(permissions.BasePermission):
    """
    Permiso personalizado que solo permite acceso a monitores.
    Incluye mensajes de error descriptivos.
    """
    
    message = "Solo los usuarios con rol de Monitor pueden realizar esta acción."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            self.message = "Debe estar autenticado para realizar esta acción."
            return False
        
        try:
            user_role = request.user.profile.role
        except AttributeError:
            self.message = "El usuario no tiene un perfil configurado."
            return False
        
        if user_role != 'monitor':
            self.message = f"Rol '{user_role}' no tiene permisos para esta acción. Se requiere rol: monitor"
            return False
        
        return True
    
class IsAdmin(permissions.BasePermission):
    """
    Permiso personalizado que solo permite acceso a administradores.
    Incluye mensajes de error descriptivos.
    """
    
    message = "Solo los usuarios con rol de Administrador pueden realizar esta acción."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            self.message = "Debe estar autenticado para realizar esta acción."
            return False
        
        try:
            user_role = request.user.profile.role
        except AttributeError:
            self.message = "El usuario no tiene un perfil configurado."
            return False
        
        if user_role != 'administrador':
            self.message = f"Rol '{user_role}' no tiene permisos para esta acción. Se requiere rol: administrador"
            return False
        
        return True
