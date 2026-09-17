export const isStrongPassword = (password) => (
  typeof password === 'string'
  && password.length >= 10
  && /[A-Z]/.test(password)
  && /[a-z]/.test(password)
  && /[^A-Za-z0-9]/.test(password)
);

export const passwordRequirementsMessage = 'Password must be at least 10 characters and include an uppercase letter, a lowercase letter, and a special character';