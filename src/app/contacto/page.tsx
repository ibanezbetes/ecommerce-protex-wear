'use client';
import React, { useState } from 'react';
import { useToast } from '@/components/Feedback/ToastProvider';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config';

export default function ContactPage() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    consulta: '',
    privacidad: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Form data submitted:', formData);
    toast.success({
      title: 'Mensaje enviado correctamente',
      message: 'Gracias por contactarnos. Nuestro equipo se pondrá en contacto contigo pronto.',
    });
    
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      consulta: '',
      privacidad: false
    });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-indigo-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-indigo-800/80 z-10 mix-blend-multiply" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=2000" 
            alt="Atención al cliente" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 text-sm font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            Atención Personalizada
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Estamos aquí para ayudarte
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100/90">
            ¿Necesitas presupuesto para tu empresa? ¿Dudas sobre normativas EPIs? Nuestro equipo de especialistas resolverá todas tus consultas al instante.
          </p>
        </div>
        
        {/* Decorative SVG Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123,194.5,115.54,242.15,109.95,285.34,74.52,321.39,56.44Z" className="fill-gray-50/50"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Envíanos un mensaje</h2>
              <p className="text-gray-500">Rellena el formulario y un asesor especializado te contactará en menos de 24 horas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-bold text-gray-700">Nombre completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors outline-none"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefono" className="block text-sm font-bold text-gray-700">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors outline-none"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors outline-none"
                  placeholder="tu@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="consulta" className="block text-sm font-bold text-gray-700">¿En qué podemos ayudarte? *</label>
                <textarea
                  id="consulta"
                  name="consulta"
                  value={formData.consulta}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors outline-none resize-none"
                  placeholder="Detalla aquí tu consulta, número de empleados para presupuestos, marcas de interés, etc..."
                ></textarea>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id="privacidad"
                    name="privacidad"
                    checked={formData.privacidad}
                    onChange={handleCheckboxChange}
                    required
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600 focus:ring-offset-0"
                  />
                </div>
                <label htmlFor="privacidad" className="text-sm text-gray-600 leading-snug">
                  He leído y acepto la <a href="/politica-de-privacidad" target="_blank" className="text-indigo-600 font-bold hover:underline">Política de Privacidad</a>. Consiento el tratamiento de mis datos personales para recibir respuesta a mi consulta bajo la responsabilidad de {BUSINESS_CONFIG.name}.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
                {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Info & Map */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Info Cards */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Ubicación Central</h4>
                    <p className="text-gray-500 mt-1">{BUSINESS_CONFIG.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Llámanos</h4>
                    <a href={`tel:${BUSINESS_CONFIG.phone}`} className="block text-indigo-600 font-semibold mt-1 hover:underline">
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <a href={`mailto:${BUSINESS_CONFIG.email}`} className="block text-indigo-600 font-semibold mt-1 hover:underline">
                      {BUSINESS_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Horario de Atención</h4>
                    <p className="text-gray-500 mt-1">Lunes - Viernes: <br/>7:00h - 15:00h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Guarantee Card */}
            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl">
              <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Garantía de Respuesta</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Nos tomamos muy en serio la seguridad de tu empresa. Todas las solicitudes recibidas a través de este canal son procesadas con prioridad máxima por nuestro equipo técnico.
              </p>
            </div>
            
          </div>
        </div>

        {/* Full Width Map Bottom */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-2 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2980.96198887354!2d-0.794688223926731!3d41.656563271266975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDM5JzIzLjYiTiAwwrA0NyczMS42Ilc!5e0!3m2!1ses!2ses!4v1764322231677!5m2!1ses!2ses"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full filter contrast-100"
            title="Ubicación Protexwear"
          ></iframe>
        </div>
      </div>
    </main>
  );
}
