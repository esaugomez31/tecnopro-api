const units = [
  "",
  "UN",
  "DOS",
  "TRES",
  "CUATRO",
  "CINCO",
  "SEIS",
  "SIETE",
  "OCHO",
  "NUEVE",
  "DIEZ",
  "ONCE",
  "DOCE",
  "TRECE",
  "CATORCE",
  "QUINCE",
  "DIECISEIS",
  "DIECISIETE",
  "DIECIOCHO",
  "DIECINUEVE",
  "VEINTE",
]

const tens = [
  "",
  "",
  "VEINTE",
  "TREINTA",
  "CUARENTA",
  "CINCUENTA",
  "SESENTA",
  "SETENTA",
  "OCHENTA",
  "NOVENTA",
]

const hundreds = [
  "",
  "CIENTO",
  "DOSCIENTOS",
  "TRESCIENTOS",
  "CUATROCIENTOS",
  "QUINIENTOS",
  "SEISCIENTOS",
  "SETECIENTOS",
  "OCHOCIENTOS",
  "NOVECIENTOS",
]

const numberToWordsHelper = (inputNumber: number): string => {
  if (inputNumber === 0) return "CERO"

  const MILLION = 1_000_000
  const THOUSAND = 1_000

  let words = ""
  let remaining = inputNumber

  if (remaining >= MILLION) {
    words += numberToWordsHelper(Math.floor(remaining / MILLION)) + " MILLONES "
    remaining %= MILLION
  }
  if (remaining >= THOUSAND) {
    words += numberToWordsHelper(Math.floor(remaining / THOUSAND)) + " MIL "
    remaining %= THOUSAND
  }
  if (remaining >= 100) {
    words += hundreds[Math.floor(remaining / 100)]
    remaining %= 100
    if (remaining > 0) words += " "
  }
  if (remaining >= 20) {
    words += tens[Math.floor(remaining / 10)]
    remaining %= 10
    if (remaining > 0) words += " Y "
  }
  if (remaining > 0) {
    words += units[remaining]
  }

  return words.trim()
}

const formatDollars = (num: number): string => {
  const word = numberToWordsHelper(num)
  return num === 1 ? "UN DOLAR" : word + " DOLARES" // handle singular
}

const formatCents = (num: number): string => {
  const word = numberToWordsHelper(num)
  return num === 1 ? "UN CENTAVO" : word + " CENTAVOS" // handle singular
}

export function numberToWords(amount: number): string {
  const amountString = amount.toFixed(2).toString()
  const [wholePart, fractionalPart] = amountString.split(".")

  const fractionalPartToShow = fractionalPart !== "" ? fractionalPart : "00"
  const dollars = formatDollars(parseInt(wholePart))
  const cents =
    fractionalPart !== "" && fractionalPart !== undefined
      ? formatCents(parseInt(fractionalPart))
      : "CERO CENTAVOS"

  return `${dollars} CON ${cents} ${fractionalPartToShow}/100`.toUpperCase()
}
