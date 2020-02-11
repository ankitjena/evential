export function isComplete(obj: object): boolean {
  for (const value of Object.values(obj)) {
    if (value === '') {
      return false;
    }
  }
  return true;
}
