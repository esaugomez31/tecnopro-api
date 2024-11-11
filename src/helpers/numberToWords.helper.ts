const units = [
  '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE',
  'DIECIOCHO', 'DIECINUEVE', 'VEINTE'
]

const tens = [
  '', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA',
  'SETENTA', 'OCHENTA', 'NOVENTA'
]

const hundreds = [
  '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS',
  'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
]

const numberToWordsHelper = (num: number): string => {
  if (num === 0) return 'CERO'
  let word = ''

  if (num >= 1000000) {
    word += numberToWordsHelper(Math.floor(num / 1000000)) + ' MILLONES '
    num %= 1000000
  }
  if (num >= 1000) {
    word += numberToWordsHelper(Math.floor(num / 1000)) + ' MIL '
    num %= 1000
  }
  if (num >= 100) {
    word += hundreds[Math.floor(num / 100)]
    num %= 100
    if (num > 0) word += ' '
  }
  if (num >= 20) {
    word += tens[Math.floor(num / 10)]
    num %= 10
    if (num > 0) word += ' Y ' // Use 'Y' only between tens and ones
  }
  if (num > 0) {
    word += units[num]
  }

  return word.trim()
}

const formatDollars = (num: number): string => {
  const word = numberToWordsHelper(num)
  return num === 1 ? 'UN DOLAR' : word + ' DOLARES' // handle singular
}

const formatCents = (num: number): string => {
  const word = numberToWordsHelper(num)
  return num === 1 ? 'UN CENTAVO' : word + ' CENTAVOS' // handle singular
}

export function numberToWords (amount: number): string {
  const amountString = amount.toFixed(2).toString()
  const [wholePart, fractionalPart] = amountString.split('.')

  const fractionalPartToShow = fractionalPart !== '' ? fractionalPart : '00'
  const dollars = formatDollars(parseInt(wholePart))
  const cents = fractionalPart !== '' && fractionalPart !== undefined ? formatCents(parseInt(fractionalPart)) : 'CERO CENTAVOS'

  return `${dollars} CON ${cents} ${fractionalPartToShow}/100`.toUpperCase()
}
