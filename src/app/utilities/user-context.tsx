import { createContext } from 'react';

// Define the shape of the context
interface UserContextType {
  token: string; // Adjust this type as needed
  // Add other properties here if needed
}

// Initialize the context with a default value (empty object)
const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
