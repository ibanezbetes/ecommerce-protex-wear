import React, { useState, useEffect } from 'react';

/**
 * Visor de correos simulados (solo para desarrollo/demo)
 * Lee los correos generados por emailService desde el localStorage
 */
function EmailDemoPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [viewType, setViewType] = useState<'customer' | 'owner'>('customer');

  useEffect(() => {
    // Load sent emails from localStorage
    const saved = localStorage.getItem('protex-sent-emails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reverse to show newest first
        setEmails(parsed.reverse());
        if (parsed.length > 0) {
          setSelectedEmail(parsed[0]);
        }
      } catch (e) {
        console.error('Error parsing demo emails', e);
      }
    }
  }, []);

  const clearEmails = () => {
    if (window.confirm('¿Seguro que quieres borrar todo el historial de correos de prueba?')) {
      localStorage.removeItem('protex-sent-emails');
      setEmails([]);
      setSelectedEmail(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visor de Correos (Demo)</h1>
          <p className="text-gray-600">
            Aquí puedes ver exactamente cómo lucirán los correos enviados al cliente y a ti (el dueño) tras cada compra.
            En un entorno real, estos HTML se enviarían a través de AWS SES o EmailJS.
          </p>
        </div>
        <button 
          onClick={clearEmails}
          className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Limpiar Historial
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No hay correos en el historial</h2>
          <p className="text-gray-600 mb-6">Realiza una compra de prueba para ver los correos generados.</p>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Sidebar - Email List */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Historial de Envíos</h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {emails.map((email, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                      selectedEmail === email ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900">{email.orderNumber}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(email.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate mb-1">{email.customerEmail}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {email.paymentMethod}
                      </span>
                      <span className="text-xs font-bold text-green-600 ml-auto">
                        €{email.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main - Email Viewer */}
          <div className="flex-1 w-full bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            
            {/* Toolbar */}
            <div className="bg-white p-3 border-b border-gray-200 flex flex-wrap gap-2 justify-between items-center shadow-sm z-10">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewType('customer')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewType === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Vista Cliente
                </button>
                <button 
                  onClick={() => setViewType('owner')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewType === 'owner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Vista Dueño
                </button>
              </div>
              
              {selectedEmail && (
                <div className="text-sm text-gray-500">
                  Para: <span className="font-medium text-gray-900">
                    {viewType === 'customer' ? selectedEmail.customerEmail : selectedEmail.ownerEmail}
                  </span>
                </div>
              )}
            </div>

            {/* Email Canvas */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-200">
              {selectedEmail ? (
                <div 
                  className="bg-white shadow-lg w-full max-w-2xl min-h-[600px]"
                  dangerouslySetInnerHTML={{ 
                    __html: viewType === 'customer' ? selectedEmail.customerHTML : selectedEmail.ownerHTML 
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Selecciona un correo para previsualizarlo
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailDemoPage;
