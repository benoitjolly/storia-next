import { NextResponse } from 'next/server';

// Types
type PodcastFormData = {
  title: string;
  description: string;
  category: string;
  duration: string;
  guests: string;
  topics: string;
  transcript?: string;
};

type PodcastResult = {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  url: string;
  createdAt: string;
  transcript?: string;
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
    createdAt: '2023-10-15T14:30:00.000Z',
    transcript: `ALEX: Bienvenue dans notre podcast sur l'intelligence artificielle ! Aujourd'hui, nous allons explorer les fondamentaux de cette technologie fascinante qui transforme notre monde.

MARIE: Merci de m'accueillir, Alex. Je suis ravie de partager mes connaissances sur ce sujet passionnant.

ALEX: Marie, en tant qu'experte en IA, pouvez-vous nous expliquer simplement ce qu'est l'intelligence artificielle ?

MARIE: Bien sûr. L'intelligence artificielle est un domaine de l'informatique qui vise à créer des machines capables d'imiter l'intelligence humaine...`
  },
  {
    id: 'podcast-2',
    title: 'Développement Web en 2024',
    description: 'Les dernières tendances du développement web',
    duration: '32',
    format: 'mp3',
    url: '/podcasts/web-dev-2024.mp3',
    createdAt: '2023-11-20T09:15:00.000Z',
    transcript: `ALEX: Bienvenue à tous dans ce nouveau podcast dédié au développement web en 2024. Je suis Alex, votre hôte, et aujourd'hui nous allons explorer les tendances qui façonnent le paysage du développement web cette année.

THOMAS: Ravi d'être avec vous aujourd'hui, Alex. Il y a vraiment beaucoup de choses excitantes à discuter dans le domaine du développement web cette année.

ALEX: Absolument, Thomas ! Commençons par parler des frameworks JavaScript. Qu'est-ce qui domine le marché en 2024 ?

THOMAS: C'est intéressant que tu poses cette question, car nous voyons une consolidation autour de quelques frameworks majeurs...`
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
    
    // Simuler un délai de génération (même si avec Gemini, c'est déjà fait)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Créer un nouveau podcast
    const newPodcast: PodcastResult = {
      id: `podcast-${Date.now()}`,
      title: data.title,
      description: data.description,
      duration: data.duration || '30',
      format: 'mp3',
      url: `/podcasts/${Date.now()}.mp3`,
      createdAt: new Date().toISOString(),
      transcript: data.transcript || undefined
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