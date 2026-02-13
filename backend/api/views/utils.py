from ..helper import make_aware_if_datetime, clean_dict
from ..constants import EXPECTED_HEADERS
from ..models import UserProfile
from ..services.excel_exporter import export_to_excel
from ..tools.excel_value_map import TIPO_IDENTIFICACION_MAP, SEXO_MAP, ESTADO_MAP, ESTADO_CIVIL_MAP, TIPO_SANGRE_MAP, ZONA_MAP

import pandas as pd
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

class ExportExcelView(APIView):

    def post(self, request):
        filename = request.data.get("filename")
        columns = request.data.get("columns")
        data = request.data.get("data")
        title = request.data.get("title")

        if not filename or not columns or not data:
            return Response(
                {"detail": "Parámetros incompletos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(columns, list) or not isinstance(data, list):
            return Response(
                {"detail": "Formato inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return export_to_excel(
            filename=filename,
            columns=columns,
            data=data,
            title=title
        )
    
    
class UploadExcelView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"detail": "Archivo no enviado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not file.name.endswith((".xls", ".xlsx")):
            return Response(
                {"detail": "Formato no soportado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            df = pd.read_excel(file)
        except Exception:
            return Response(
                {"detail": "Archivo Excel inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )


        MAX_ROWS = 999

        row_count = len(df)

        # if row_count > MAX_ROWS:
        #     return Response(
        #         {
        #             "detail": "El archivo supera el número máximo de registros permitidos",
        #             "max_rows": MAX_ROWS,
        #             "received_rows": row_count
        #         },
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        received_headers = list(df.columns)

        if received_headers != EXPECTED_HEADERS:
            a = Response(
                {
                    "detail": "Formato no soportado: las columnas no coinciden exactamente",
                    "expected": EXPECTED_HEADERS,
                    "received": received_headers
                },
                status=status.HTTP_400_BAD_REQUEST)
            print("A:", a)
            return Response(
                {
                    "detail": "Formato no soportado: las columnas no coinciden exactamente",
                    "expected": EXPECTED_HEADERS,
                    "received": received_headers
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        errors = []
        created = 0
        updated = 0
        skipped = 0
        for idx, row in df.iterrows():

            try:
                with transaction.atomic():

                    numero_id = str(row["Número de identificación"]).strip()

                    if not numero_id:
                        raise ValueError("Número de identificación vacío")

                    profile = UserProfile.objects.select_related("user").filter(
                        numero_identificacion=numero_id
                    ).first()

                    data = {
                        "primer_nombre": row["Primer nombre"],
                        "segundo_nombre": row["Segundo nombre"],
                        "primer_apellido": row["Primer apellido"],
                        "segundo_apellido": row["Segundo apellido"],

                        "tipo_identificacion": TIPO_IDENTIFICACION_MAP.get(row["Tipo de identificación"]),
                        "numero_identificacion": numero_id,
                        "estado": ESTADO_MAP.get(row["Estado"]),
                        "edad": row["Edad"],

                        "sede": row["Sede"],
                        "jornada": row["Jornada"],
                        "programa": row["Programa"],
                        "grupo": row["Grupo"],
                        "periodo": row["Período"],
                        "nivel": row["Nivel"],
                        "codigo_matricula": row["Código de matrícula"],
                        "lugar_expedicion_documento": row["Lugar de expedición del documento"],
                        "fecha_nacimiento": row["Fecha de nacimiento"],
                        "lugar_nacimiento": row["Lugar de nacimiento"],

                        "telefono": row["Teléfono"],
                        "celular": row["Celular"],
                        "correo_electronico": row["Correo electrónico"],
                        "direccion": row["Dirección"],
                        "pais": row["País"],
                        "lugar_residencia": row["Lugar de residencia"],
                        "barrio": row["Barrio"],

                        "sexo": SEXO_MAP.get(row["Sexo"]),
                        "estrato": row["Estrato"],
                        "estado_civil": ESTADO_CIVIL_MAP.get(row["Estado civil"]),
                        "tipo_sangre": TIPO_SANGRE_MAP.get(row["Tipo de sangre"]),
                        "eps": row["EPS"],
                        "ars": row["ARS"],
                        "aseguradora": row["Aseguradora"],
                        "grupo_sisben": row["Grupo Sisbén"],
                        "zona": ZONA_MAP.get(row["Zona"]),

                        "nivel_formacion": row["Nivel de formación"],
                        "ocupacion": row["Ocupación"],
                        "medio_transporte": row["Medio de transporte"],
                        "discapacidad": row["Discapacidad"],
                        "multiculturalidad": row["Multiculturalidad"],
                        "tipo_cancelacion": row["Tipo de cancelación"],

                        "fecha_matricula": make_aware_if_datetime(row["Fecha de matrícula"]),
                        "formalizada": row["Formalizada"],
                        "condicion_matricula": row["Cond. Matrícula"],

                        "ultima_actualizacion": make_aware_if_datetime(row["Última fecha de actualización"]),
                        "pertenece_regimen_contributivo": row["Pertenece al régimen contributivo"],
                    }

                    if profile:
                        for field, value in data.items():
                            setattr(profile, field, value)

                        profile.save()
                        updated += 1
                        print(f"ESTUDIANTE ACTUALIZADO: ({updated}) {numero_id}")

                    else:
                        user = User.objects.create_user(
                            username=numero_id,
                            password=numero_id,
                            first_name=row["Primer nombre"],
                            last_name=row["Primer apellido"],
                            email=row["Correo electrónico"],
                        )

                        UserProfile.objects.create(
                            user=user,
                            role="estudiante",
                            **data
                        )

                        created += 1
                        print(f"ESTUDIANTE CREADO: ({created}) {numero_id}")

            except Exception as e:
                skipped += 1
                errors.append({
                    "row": int(idx) + 2,
                    "numero_identificacion": numero_id if 'numero_id' in locals() else None,
                    "error": str(e)
                })
                print(f"⛔ ESTUDIANTE OMITIDO (fila {idx + 2}): {e}")
                continue


        return Response({
            "created": created,
            "updated": updated
        },
        status=status.HTTP_200_OK
        )