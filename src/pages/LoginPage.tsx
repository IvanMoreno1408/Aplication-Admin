import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

interface FormValues { email: string; password: string; }
interface FormErrors { email?: string; password?: string; }

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<FormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setApiError('');
    const { name, value } = e.target;
    setValues((prev: FormValues) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (!value.trim())
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: name === 'email' ? 'El email es obligatorio' : 'La contraseña es obligatoria',
      }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    const errs: FormErrors = {};
    if (!values.email.trim()) errs.email = 'El email es obligatorio';
    if (!values.password.trim()) errs.password = 'La contraseña es obligatoria';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const authResponse = await authService.login(values);
      login(authResponse);
      navigate('/dashboard');
    } catch (err: unknown) {
      let message = 'Correo o contraseña incorrectos.';
      if (err && typeof err === 'object') {
        const e = err as {
          response?: { data?: { error?: string; message?: string }; status?: number };
          message?: string;
          code?: string;
        };
        if (e.response?.status === 401 || e.response?.status === 403) {
          message = 'Correo o contraseña incorrectos.';
        } else if (e.response?.data?.error) {
          message = e.response.data.error;
        } else if (e.response?.data?.message) {
          message = e.response.data.message;
        } else if (e.message && (e.message.toLowerCase().includes('network') || e.message.toLowerCase().includes('connect'))) {
          message = 'No se pudo conectar al servidor. Verifica tu conexión.';
        } else if (e.message?.toLowerCase().includes('timeout') || e.code === 'ECONNABORTED') {
          message = 'El servidor tardó demasiado en responder. Intenta de nuevo.';
        } else if (e.message) {
          message = e.message;
        }
      }
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#1e5c1e' }}
      >
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-30" style={{ backgroundColor: '#2d7a2d' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20" style={{ backgroundColor: '#f5c518' }} />
        <div className="absolute top-1/3 right-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: '#f5c518' }} />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-48 h-48 rounded-full overflow-hidden mx-auto drop-shadow-xl flex items-center justify-center" style={{ backgroundColor: 'white' }}>
            <img src="/logo.png" alt="Porteño Logo" className="w-44 h-44 object-contain" />
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-widest mt-2 mb-3">CIAl</h1>

          {/* Línea amarilla */}
          <div className="w-20 h-1.5 mx-auto mb-5 rounded-full" style={{ backgroundColor: '#f5c518' }} />

          <p className="text-lg font-semibold mb-2" style={{ color: '#f5c518' }}>Panel Administrativo</p>
          <p className="text-sm max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Gestiona tu catálogo de productos de forma fácil y eficiente.
          </p>
        </div>

        {/* Barra amarilla inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: '#f5c518' }} />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto flex items-center justify-center" style={{ backgroundColor: 'white' }}>
              <img src="/logo.png" alt="Porteño Logo" className="w-28 h-28 object-contain" />
            </div>
            <p className="text-2xl font-extrabold tracking-widest mt-1" style={{ color: '#2d7a2d' }}>CIAl</p>
            <div className="w-14 h-1.5 mx-auto mt-2 rounded-full" style={{ backgroundColor: '#f5c518' }} />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Franja superior */}
            <div className="h-2" style={{ background: 'linear-gradient(to right, #1e5c1e, #f5c518, #1e5c1e)' }} />

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Bienvenido</h2>
              <p className="text-sm text-gray-500 mb-7">Ingresa tus credenciales para continuar</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email" name="email" type="email"
                      value={values.email} onChange={handleChange} onBlur={handleBlur}
                      placeholder="correo@ejemplo.com" disabled={loading}
                      className="block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 transition-colors"
                      style={{ borderColor: errors.email ? '#f87171' : '#e5e7eb' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2d7a2d'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,45,0.15)'; }}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">⚠ {errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password" name="password" type={showPassword ? 'text' : 'password'}
                      value={values.password} onChange={handleChange} onBlur={handleBlur}
                      placeholder="••••••••" disabled={loading}
                      className="block w-full pl-10 pr-12 py-3 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 transition-colors"
                      style={{ borderColor: errors.password ? '#f87171' : '#e5e7eb' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2d7a2d'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,45,0.15)'; }}
                    />
                    <button
                      type="button" tabIndex={-1}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">⚠ {errors.password}</p>}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2" role="alert">
                    <span className="text-base">✕</span>
                    {apiError}
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{ backgroundColor: loading ? '#2d7a2d' : '#2d7a2d' }}
                  onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#1e5c1e'; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#2d7a2d'; }}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Ingresar
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">© 2024 CIAl. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
