import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Ya no configuramos Amplify aquí, se hace en main.tsx
// Solo exportamos el cliente de datos
export const client = generateClient<Schema>();