import Link from 'next/link';

const categories = [
  {
    id: 'cascos',
    title: 'Cascos de Protección',
    description: 'Seguridad extrema para tu cabeza en cualquier entorno de trabajo.',
    image: '/images/category_helmet.png',
    colSpan: 'col-span-1 md:col-span-2 lg:col-span-2'
  },
  {
    id: 'calzado',
    title: 'Calzado de Seguridad',
    description: 'Botas y zapatos blindados diseñados para proteger tus pies.',
    image: '/images/category_boots.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'guantes',
    title: 'Guantes Industriales',
    description: 'Protección absoluta y agarre táctico para todo tipo de labores.',
    image: '/images/category_gloves.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'ropa',
    title: 'Alta Visibilidad',
    description: 'Ropa reflectante para máxima visibilidad y seguridad nocturna.',
    image: '/images/category_hivis.png',
    colSpan: 'col-span-1 md:col-span-2 lg:col-span-2'
  },
  {
    id: 'pantalones',
    title: 'Pantalones',
    description: 'Comodidad, flexibilidad y resistencia extrema para el día a día.',
    image: '/images/category_pants.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'camisetas',
    title: 'Camisetas y Polos',
    description: 'Ropa ligera, transpirable y muy profesional para tu jornada.',
    image: '/images/category_shirts.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'sudaderas',
    title: 'Sudaderas y Jerseys',
    description: 'Aislamiento térmico superior y confort para climas fríos.',
    image: '/images/category_sweaters.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'chaquetas',
    title: 'Chaquetas y Parkas',
    description: 'Protección total contra el frío, la lluvia y la intemperie.',
    image: '/images/category_jackets.png',
    colSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
  },
  {
    id: 'ropa de trabajo',
    title: 'Uniformes de Trabajo',
    description: 'Buzos, petos y batas profesionales para industria.',
    image: '/images/category_uniforms.png',
    colSpan: 'col-span-1 md:col-span-2 lg:col-span-2'
  }
];

export default function CategoriasPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pb-24">
      {/* Hero Header */}
      <div className="bg-indigo-900 relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-900 to-indigo-800 opacity-90 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000" 
            alt="Fondo categorías" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-300 font-extrabold tracking-widest uppercase mb-4 text-sm sm:text-base">Equipamiento por Sectores</p>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6">
            Nuestras Categorías
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100/80">
            Explora nuestra amplia gama de productos de protección laboral. Seleccionamos el equipamiento más avanzado para garantizar tu seguridad.
          </p>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123,194.5,115.54,242.15,109.95,285.34,74.52,321.39,56.44Z" className="fill-gray-50/50"></path>
          </svg>
        </div>
      </div>

      {/* Bento Grid Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/productos?categoria=${cat.id}`} 
              className={`group relative rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col min-h-[300px] md:min-h-[400px] ${cat.colSpan}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative mt-auto p-8 sm:p-10 flex flex-col items-start w-full">
                <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Ver Colección
                </span>
                <h2 className="text-3xl font-extrabold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {cat.title}
                </h2>
                <p className="text-gray-300 font-medium max-w-lg line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
