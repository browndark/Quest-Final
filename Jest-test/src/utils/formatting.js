/**
 * Funções de formatação para o Cinema App
 */

/**
 * Formata um preço em reais
 * @param {number} price - Preço a ser formatado
 * @param {boolean} showSymbol - Se deve mostrar o símbolo R$
 * @returns {string} - Preço formatado
 */
function formatPrice(price, showSymbol = true) {
  if (typeof price !== 'number' || isNaN(price)) {
    return showSymbol ? 'R$ 0,00' : '0,00';
  }
  
  const formatted = price.toFixed(2).replace('.', ',');
  return showSymbol ? `R$ ${formatted}` : formatted;
}

/**
 * Calcula o total de uma compra
 * @param {Array} seats - Array de assentos selecionados
 * @param {number} pricePerSeat - Preço por assento
 * @returns {number} - Total calculado
 */
function calculateTotal(seats = [], pricePerSeat = 0) {
  if (!Array.isArray(seats) || typeof pricePerSeat !== 'number') {
    return 0;
  }
  
  return seats.length * pricePerSeat;
}

/**
 * Formata uma data para exibição em português
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(dateString) {
  if (!dateString) return 'Data inválida';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    };
    
    return date.toLocaleDateString('pt-BR', options);
  } catch (error) {
    return 'Data inválida';
  }
}

/**
 * Formata um horário para exibição
 * @param {string|Date} dateString - Data/hora a ser formatada
 * @returns {string} - Horário formatado
 */
function formatTime(dateString) {
  if (!dateString) return 'Horário inválido';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Horário inválido';
    }
    
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    };
    
    return date.toLocaleTimeString('pt-BR', options);
  } catch (error) {
    return 'Horário inválido';
  }
}

/**
 * Formata assentos para exibição
 * @param {Array} seats - Array de assentos
 * @returns {string} - Assentos formatados
 */
function formatSeats(seats) {
  if (!Array.isArray(seats) || seats.length === 0) {
    return 'Nenhum assento';
  }
  
  return seats
    .map(seat => {
      if (seat.row && seat.number) {
        return `${seat.row}${seat.number}`;
      }
      return seat.toString();
    })
    .join(', ');
}

/**
 * Sanitiza entrada de texto
 * @param {string} text - Texto a ser sanitizado
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} - Texto sanitizado
 */
function sanitizeText(text, maxLength = 255) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/[<>&"']/g, ''); // Remove caracteres perigosos básicos
}

module.exports = {
  formatPrice,
  calculateTotal,
  formatDate,
  formatTime,
  formatSeats,
  sanitizeText
};