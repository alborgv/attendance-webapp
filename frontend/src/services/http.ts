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
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error desconocido");
        }
        return response;
    };

    return { request };
};
