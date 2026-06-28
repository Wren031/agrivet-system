import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    fullName: 'John Doe',
    email: 'customer@agrivet.com',
    phoneNumber: '+63 912 345 6789',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=22C55E&color=fff&size=200',
    address: '123 Farmville St., Manila',
  },
  {
    id: 'usr-002',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: '+63 923 456 7890',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=3B82F6&color=fff&size=200',
    address: '456 Harvest Rd., Quezon City',
  },
];

export const mockCredentials = {
  email: 'customer@agrivet.com',
  password: 'password123',
};
