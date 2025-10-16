export const stringToBoolean = (str: any): boolean | undefined => {
  if (typeof str === "string") {
    return str.toLowerCase() === "true" || str === "1"
  }

  return str
}
