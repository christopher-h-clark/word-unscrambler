export interface IUserDTO {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export const getUserFullName = (user: IUserDTO): string => `${user.firstName} ${user.lastName}`;
