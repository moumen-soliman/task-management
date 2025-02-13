// fetch instance
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${response.statusText}\n${JSON.stringify(errorData)}`);
  }
  return response.json();
};
