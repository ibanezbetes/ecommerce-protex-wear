import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const categories = [
  {
    id: 'cascos',
    title: 'Cascos de Protección',
    description: 'Seguridad para tu cabeza en cualquier entorno de trabajo.',
    image: '/categorias/cascos.png'
  },
  {
    id: 'calzado',
    title: 'Calzado',
    description: 'Botas y zapatos diseñados para proteger tus pies.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'guantes',
    title: 'Guantes de Trabajo',
    description: 'Protección y agarre para todo tipo de labores.',
    image: 'https://images.unsplash.com/photo-1584448578680-349f48f438ac?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pantalones',
    title: 'Pantalones',
    description: 'Comodidad y resistencia para el día a día.',
    image: '/categorias/pantalones.png'
  },
  {
    id: 'camisetas',
    title: 'Camisetas y Polos',
    description: 'Ropa ligera y profesional para tu jornada.',
    image: '/categorias/camisetas.png'
  },
  {
    id: 'sudaderas',
    title: 'Sudaderas y Jerseys',
    description: 'Aislamiento térmico y confort.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'chaquetas',
    title: 'Chaquetas y Parkas',
    description: 'Protección contra el frío y la intemperie.',
    image: '/categorias/chaquetas.png'
  },
  {
    id: 'chalecos',
    title: 'Chalecos',
    description: 'Libertad de movimiento con múltiples bolsillos.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'calcetines',
    title: 'Calcetines',
    description: 'Comodidad desde la base.',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ropa de trabajo',
    title: 'Ropa de Trabajo',
    description: 'Buzos, petos y batas profesionales.',
    image: 'https://images.unsplash.com/photo-1588612140660-f383e2f949c8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'accesorios',
    title: 'Accesorios',
    description: 'Gorras, cinturones, delantales y más.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  }
];

export default function CategoriasPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Nuestras Categorías</h1>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/productos?categoria=${cat.id}`} className={styles.card}>
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <h2 className={styles.categoryTitle}>{cat.title}</h2>
              <p className={styles.categoryDesc}>{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
