export const SET_USER = 'SET_USER';


export function setUser(username) {
  return { type: SET_USER, username: username };
}

