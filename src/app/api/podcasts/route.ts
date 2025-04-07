import { NextResponse } from 'next/server';

// Types
type PodcastFormData = {
  title: string;
  description: string;
  category: string;
  duration: string;
  guests: string;
  topics: string;
};

type PodcastResult = {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  url: string;
  createdAt: string;
};

// Base de données en mémoire pour la démo
const PODCASTS_DB: PodcastResult[] = [
  {
    id: 'podcast-1',
    title: 'Introduction à l\'IA',
    description: 'Une exploration des fondamentaux de l\'intelligence artificielle',
    duration: '45',
    format: 'mp3',
    url: '/podcasts/ia-intro.mp3',
    createdAt: '2023-10-15T14:30:00.000Z'
  },
  {
    id: 'podcast-2',
    title: 'Développement Web en 2024',
    description: 'Les dernières tendances du développement web',
    duration: '32',
    format: 'mp3',
    url: '/podcasts/web-dev-2024.mp3',
    createdAt: '2023-11-20T09:15:00.000Z'
  }
];

/**
 * Gestionnaire GET pour récupérer tous les podcasts
 */
export async function GET() {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return NextResponse.json(PODCASTS_DB);
}

/**
 * Gestionnaire POST pour créer un nouveau podcast
 */
export async function POST(request: Request) {
  try {
    const data = await request.json() as PodcastFormData;
    
    // Validation des données
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Le titre et la description sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Simuler un délai de génération
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Créer un nouveau podcast
    const newPodcast: PodcastResult = {
      id: `podcast-${Date.now()}`,
      title: data.title,
      description: data.description,
      duration: data.duration || '30',
      format: 'mp3',
      url: `/podcasts/${Date.now()}.mp3`,
      createdAt: new Date().toISOString()
    };
    
    // Ajouter à notre "base de données"
    PODCASTS_DB.push(newPodcast);
    
    return NextResponse.json(newPodcast, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du podcast' },
      { status: 500 }
    );
  }
} 