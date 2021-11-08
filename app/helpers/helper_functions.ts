function validateEmail(email) {
  const r = /\S+@\S+\.\S+/
  return r.test(email)
}

export default validateEmail
