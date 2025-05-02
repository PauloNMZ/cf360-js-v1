
/**
 * Check digit calculation and verification utility functions for CNAB files
 */

// Calculate verification digit - Corrected implementation as per user's input
export const calcularDV = (strNumero: string): string => {
  // Remove white spaces from the number
  const strNum = strNumero.trim();
  
  // Return null string if null string was passed or contains non-digits
  if (strNum.length === 0 || !/^\d+$/.test(strNum)) {
    return "";
  }
  
  // String for calculation
  let strCalc = "23456789";
  
  // Increase calculation string size
  while (strNum.length > strCalc.length) {
    strCalc += strCalc;
  }
  
  // Make calculation string the same size as number
  strCalc = strCalc.slice(-strNum.length);
  
  // Multiply calculation string with number and accumulate
  let intAcum = 0;
  for (let intC = 0; intC < strNum.length; intC++) {
    intAcum += parseInt(strNum[intC]) * parseInt(strCalc[intC]);
  }
  
  // Find remainder of division by 11 which is the DV
  const intResto = intAcum % 11;
  
  // Return verification digit
  return intResto !== 10 ? intResto.toString() : "X";
};

