/**
 * Funções de validação para o Cinema App
 */

/**
 * Valida se um email tem formato válido
 * @param {string} email - Email para validar
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Regex básica para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Não pode começar ou terminar com ponto
  if (email.startsWith('.') || email.endsWith('.')) {
    return false;
  }
  
  // Não pode ter pontos consecutivos
  if (email.includes('..')) {
    return false;
  }
  
  // Não pode ter ponto antes ou depois do @
  if (email.includes('.@') || email.includes('@.')) {
    return false;
  }
  
  // Testa com regex
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Verifica se o TLD tem pelo menos 2 caracteres
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const domain = parts[1];
  const tldParts = domain.split('.');
  const tld = tldParts[tldParts.length - 1];
  
  return tld && tld.length >= 2;
}

/**
 * Valida se uma senha atende aos critérios mínimos
 * @param {string} password - Senha para validar
 * @returns {object} - Objeto com isValid e erros
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Senha é obrigatória'] };
  }
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('Senha deve ter no máximo 128 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida se um nome é válido
 * @param {string} name - Nome para validar
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  
  // Deve ter pelo menos 2 caracteres
  if (trimmedName.length < 2) {
    return false;
  }
  
  // Deve ter no máximo 100 caracteres
  if (trimmedName.length > 100) {
    return false;
  }
  
  // Deve conter apenas letras, espaços, acentos e hífens
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return nameRegex.test(trimmedName);
}

/**
 * Valida se as senhas coincidem
 * @param {string} password - Senha principal
 * @param {string} confirmPassword - Confirmação da senha
 * @returns {boolean} - True se coincidem, false caso contrário
 */
function validatePasswordConfirmation(password, confirmPassword) {
  return password === confirmPassword;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordConfirmation
};