
import {
  LOGIN,
} from './constants';

export function login(username, password) {
  console.log(username, password);
  return {
    type: LOGIN,
  };
}
