export const stringToBoolean = (
  str: string | boolean | undefined,
): boolean | undefined => {
  if (typeof str === "string") {
    return str.toLowerCase() === "true" || str === "1"
  }

  return str
}
