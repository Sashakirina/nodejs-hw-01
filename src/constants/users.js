export const emailRegexp =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const accessTokenLifeTime = 15 * 60 * 1000;
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24;
