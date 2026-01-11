/**
 * Unit tests for NewPasswordModal Component
 * Tests the password change challenge flow
 */

import * as fs from 'fs';
import * as path from 'path';

describe('NewPasswordModal Component', () => {
  const modalPath = path.join(__dirname, '../../src/components/auth/NewPasswordModal.tsx');
  
  describe('Component Structure', () => {
    test('should have NewPasswordModal component file', () => {
      expect(fs.existsSync(modalPath)).toBe(true);
    });

    test('should export default NewPasswordModal function', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      expect(content).toContain('export default function NewPasswordModal');
    });

    test('should import useAuth hook', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      expect(content).toContain("import { useAuth } from '../../contexts/AuthContext'");
    });

    test('should have proper TypeScript interface', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      expect(content).toContain('interface NewPasswordModalProps');
      expect(content).toContain('isOpen: boolean');
      expect(content).toContain('email: string');
      expect(content).toContain('challengeType: \'NEW_PASSWORD_REQUIRED\' | \'FORCE_CHANGE_PASSWORD\'');
    });
  });

  describe('Password Validation Logic', () => {
    test('should include password strength requirements', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      // Check for password validation patterns
      expect(content).toContain('/[A-Z]/'); // Uppercase
      expect(content).toContain('/[a-z]/'); // Lowercase  
      expect(content).toContain('/\\d/'); // Numbers
      expect(content).toContain('/[!@#$%^&*(),.?":{}|<>]/'); // Special chars
    });

    test('should have minimum length validation', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      expect(content).toContain('newPassword.length < 8');
    });

    test('should validate password confirmation', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      expect(content).toContain('newPassword !== confirmPassword');
    });
  });

  describe('UI Elements', () => {
    test('should have form elements', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      // Form elements
      expect(content).toContain('type="password"');
      expect(content).toContain('onSubmit={handleSubmit}');
      expect(content).toContain('Nueva Contraseña');
      expect(content).toContain('Confirmar Contraseña');
    });

    test('should have challenge type specific content', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      expect(content).toContain('Establecer Nueva Contraseña');
      expect(content).toContain('Cambiar Contraseña Obligatorio');
    });

    test('should have password requirements display', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      expect(content).toContain('Requisitos de contraseña');
      expect(content).toContain('Mínimo 8 caracteres');
      expect(content).toContain('Al menos 1 letra mayúscula');
      expect(content).toContain('Al menos 1 letra minúscula');
      expect(content).toContain('Al menos 1 número');
      expect(content).toContain('Al menos 1 carácter especial');
    });
  });

  describe('Integration with AuthContext', () => {
    test('should call confirmNewPassword from useAuth', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      expect(content).toContain('const { confirmNewPassword } = useAuth()');
      expect(content).toContain('await confirmNewPassword(newPassword)');
    });

    test('should handle loading states', () => {
      const content = fs.readFileSync(modalPath, 'utf-8');
      
      expect(content).toContain('const [isLoading, setIsLoading] = useState(false)');
      expect(content).toContain('setIsLoading(true)');
      expect(content).toContain('disabled={isLoading}');
    });
  });
});