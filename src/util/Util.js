export function hasNumber(myString) {
  return /\d/.test(myString);
}

export function hasLowerCase(str) {
  return /[a-z]/.test(str);
}

export function hasUpperCase(str) {
  return /[A-Z]/.test(str);
}

export function getMinPasswordLength() {
  return 5;
}