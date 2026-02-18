export const formatNumber = (val: unknown) => {
    const numericValue = Number(val);

    if (isNaN(numericValue)) return val;

    return new Intl.NumberFormat('es-CO', {
        maximumFractionDigits: 2,
    }).format(numericValue);
};
