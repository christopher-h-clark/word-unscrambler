import axios from 'axios';
import type { IUserDTO } from '../types/shared';

export function loadUsersAPI(): Promise<IUserDTO[]> {
  return axios.get(`/api/users`).then((res) => res.data);
}
