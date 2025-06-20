const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const fetchChatReply = async (message, model, idToken) => {
  if (!idToken) {
    throw new Error("No ID token provided. User might not be authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ message, model }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "Failed to parse error response" }));
    console.error("API Error Response:", errorBody);
    const errorMessage = errorBody.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}; 