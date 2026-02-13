from django.utils import timezone
import pandas as pd

def make_aware_if_datetime(value):
    if pd.isna(value):
        return None

    if isinstance(value, (timezone.datetime,)):
        if timezone.is_naive(value):
            return timezone.make_aware(value)
        return value

    return value

def clean_value(value):
    if pd.isna(value):
        return None
    return value

def clean_dict(data: dict, drop_none=True):
    cleaned = {k: clean_value(v) for k, v in data.items()}
    if drop_none:
        cleaned = {k: v for k, v in cleaned.items() if v is not None}
    return cleaned


import unicodedata
import re

def normalize_text(value: str) -> str:
    value = value.strip().upper()

    value = unicodedata.normalize('NFKD', value)
    value = ''.join(c for c in value if not unicodedata.combining(c))

    value = re.sub(r'\s+', ' ', value)

    return value
