/**
 * Shared Validators - Validaciones reutilizables
 * Usar las MISMAS validaciones en client (UI) y server (seguridad)
 */
import { VALIDATION } from './constants.js';

export const validators = {
  /**
   * Valida un mensaje de chat
   */
  validateMessage: (message) => {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'El mensaje debe ser un texto' };
    }
    
    const trimmed = message.trim();
    
    if (trimmed.length === 0) {
      return { valid: false, error: 'El mensaje no puede estar vacío' };
    }
    
    if (trimmed.length > VALIDATION.MESSAGE_MAX_LENGTH) {
      return { 
        valid: false, 
        error: `El mensaje no puede exceder ${VALIDATION.MESSAGE_MAX_LENGTH} caracteres` 
      };
    }
    
    return { valid: true, data: trimmed };
  },

  /**
   * Valida un nombre de usuario
   */
  validateUsername: (username) => {
    if (!username || typeof username !== 'string') {
      return { valid: false, error: 'El nombre de usuario es requerido' };
    }
    
    const trimmed = username.trim();
    
    if (trimmed.length < VALIDATION.USERNAME_MIN_LENGTH) {
      return { 
        valid: false, 
        error: `El nombre debe tener al menos ${VALIDATION.USERNAME_MIN_LENGTH} caracteres` 
      };
    }
    
    if (trimmed.length > VALIDATION.USERNAME_MAX_LENGTH) {
      return { 
        valid: false, 
        error: `El nombre no puede exceder ${VALIDATION.USERNAME_MAX_LENGTH} caracteres` 
      };
    }
    
    // Solo letras, números, espacios y guiones
    if (!/^[a-zA-Z0-9\s-]+$/.test(trimmed)) {
      return { 
        valid: false, 
        error: 'El nombre solo puede contener letras, números, espacios y guiones' 
      };
    }
    
    return { valid: true, data: trimmed };
  },

  /**
   * Valida un email
   */
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'El email es requerido' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Email inválido' };
    }
    
    return { valid: true, data: email.toLowerCase() };
  },
};
