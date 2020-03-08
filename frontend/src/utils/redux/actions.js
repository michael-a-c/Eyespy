export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';


export function setUser(username) {
  return { type: SET_USER, username: username };
}

export function removeUser() {
  return { type: REMOVE_USER };
}

