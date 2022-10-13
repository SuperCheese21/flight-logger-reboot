export const DIGIT_REGEX = /[0-9]/g;
export const PASSWORD_REQUIREMENT_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,255}$/;
export const PASSWORD_REQUIREMENT_STRING =
  'Password must be at least 8 characters and must include at least one upper case letter, one lower case letter, and one numeric digit.';
