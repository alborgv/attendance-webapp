export const createHttpClient = ({
    apiUrl,
    tokens,
    onUnauthorized,
}: {
    apiUrl: string;
    tokens: AuthTokens;
    onUnauthorized: () => void;
}) => {

    const request = async (
        path: string,
        options: RequestInit = {}
    ) => {
        const isFormData = options.body instanceof FormData;

        const response = await fetch(`${apiUrl}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${tokens.access}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(options.headers || {}),
            },
        });

        if (response.status === 401) {
            onUnauthorized();
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                throw new Error("Error de conexión");
            }

            let errorMessage = errorData.detail;
            
            if (!errorMessage && errorData && typeof errorData === 'object') {
                const messages = Object.values(errorData).flat();
                if (messages.length > 0 && typeof messages[0] === 'string') {
                    errorMessage = messages[0];
                }
            }
            
            throw new Error(errorMessage || "Error desconocido");
        }
        return response;
    };

    return { request };
};
