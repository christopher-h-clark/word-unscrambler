import type { IUserDTO } from './types/shared';

export const users: IUserDTO[] = [
  {
    imageUrl: '/assets/gil.jpg',
    userId: '1',
    firstName: 'Gil',
    lastName: 'Amran',
  },
  {
    imageUrl: '/assets/noa.jpg',
    userId: '2',
    firstName: 'Noa',
    lastName: 'Tevel',
  },
  {
    imageUrl: '/assets/john.jpg',
    userId: '3',
    firstName: 'John',
    lastName: 'Doe',
  },
];

export function getUserById(userId: string): IUserDTO | null {
  return users.find((u) => u.userId === userId) ?? null;
}
