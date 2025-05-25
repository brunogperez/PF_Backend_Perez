import bcrypt from 'bcrypt'

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password, userPassword) => { 
  return bcrypt.compareSync(password, userPassword) 
}

export const isStrongPassword = (password) => {
  // At least 8 characters long
  if (password.length < 8) return false;
  
  // Contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Contains at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Contains at least one number
  if (!/\d/.test(password)) return false;
  
  // Contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  return true;
}
