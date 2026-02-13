from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..serializers import ChangePasswordSerializer

class ChangeUserPasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    queryset = User.objects.all()
    lookup_field = 'id'
    # permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data["password"])
        user.save(update_fields=["password"])

        return Response(
            {"detail": "Contraseña actualizada correctamente"},
            status=status.HTTP_200_OK)