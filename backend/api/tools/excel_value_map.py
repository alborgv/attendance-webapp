# excel_value_maps.py
# Maps de valores provenientes de Excel → valores internos del modelo Django


# -------------------------
# Sexos
# -------------------------

SEXO_MAP = {
    "Masculino": "M",
    "Femenino": "F",
}

# -------------------------
# Tipo de identificación
# -------------------------
TIPO_IDENTIFICACION_MAP = {
    "Cédula de Ciudadanía": "CC",
    "Cédula de Extranjería": "CE",
    "Tarjeta de Identidad": "TI",
    "Pasaporte": "PAS",
    "Estudiante Extra": "EX",
    "Monitor": "MN",
}


# -------------------------
# Estados académicos
# -------------------------
ESTADO_MAP = {
    "Activo": "A",
    "Inactivo": "I",
    "Graduado": "G",
    "Cancelado": "C",
}


# -------------------------
# Estados civiles
# -------------------------
ESTADO_CIVIL_MAP = {
    "Soltero/a": "SOL",
    "Soltero(a)": "SOL",   # por si Excel viene distinto
    "Casado/a": "CAS",
    "Divorciado/a": "DIV",
    "Viudo/a": "VIU",
    "Unión Libre": "UL",
    "Union Libre": "UL",   # sin tilde
}


# -------------------------
# Tipos de sangre
# -------------------------
TIPO_SANGRE_MAP = {
    "A+": "A+",
    "A-": "A-",
    "B+": "B+",
    "B-": "B-",
    "AB+": "AB+",
    "AB-": "AB-",
    "O+": "O+",
    "O-": "O-",
}


# -------------------------
# Zonas
# -------------------------
ZONA_MAP = {
    "Urbana": "U",
    "Rural": "R",
}
