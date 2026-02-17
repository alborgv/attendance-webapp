from django.contrib.auth.models import User

from rest_framework import status, generics
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from ..models import UserProfile
from ..permissions import IsMonitor, IsAdmin
from ..serializers import ChangeMonitorRoleSerializer, CrearMonitorSerializer, MonitorSerializer
from ..pagination import StandardResultsSetPagination
from ..filters import MonitorFilter
            
class MonitorListView(generics.ListAPIView):
    serializer_class = MonitorSerializer
    permission_classes = [IsMonitor | IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_class = MonitorFilter
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return (
            User.objects
            .select_related('profile')
            .filter(profile__role='monitor')
        )
        
class MonitorCreateView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = CrearMonitorSerializer
    permission_classes = [IsMonitor | IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class MonitorRoleView(generics.GenericAPIView):
    serializer_class = ChangeMonitorRoleSerializer
    queryset = User.objects.all()
    lookup_field = 'id'
    # permission_classes = [IsAdmin]

    def patch(self, request, *args, **kwargs):
        profile = self.get_object().profile 

        new_role = request.data.get("role")

        if new_role not in dict(UserProfile.ROLE_CHOICES):
            return Response(
                {"detail": "Rol inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if profile.role == new_role:
            return Response(
                {"detail": "El usuario ya tiene ese rol"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.role = new_role
        profile.save(update_fields=["role"])

        return Response(
            {"detail": f"Rol actualizado a {new_role}"},
            status=status.HTTP_200_OK
        )
        
class DeleteMonitorView(generics.GenericAPIView):
    serializer_class = ChangeMonitorRoleSerializer
    queryset = UserProfile.objects.all()
    lookup_field = 'pk'
    # permission_classes = [IsAdmin]

    def patch(self, request, *args, **kwargs):
        profile = self.get_object() 

        if profile.role != 'monitor':
            return Response(
                {"detail": "El usuario no es monitor"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.role = 'estudiante'
        profile.save(update_fields=['role'])

        return Response(
            {"detail": "Rol de monitor removido correctamente"},
            status=status.HTTP_200_OK
        )
    