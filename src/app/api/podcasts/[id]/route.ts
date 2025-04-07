import { NextRequest, NextResponse } from 'next/server';

// Type pour les podcasts
type PodcastResult = {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  url: string;
  createdAt: string;
};

// Base de données en mémoire pour la démo (même données que dans la route principale)
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
 * Récupère un podcast spécifique par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Rechercher le podcast par ID
    const podcast = PODCASTS_DB.find(p => p.id === params.id);
    
    if (!podcast) {
      return NextResponse.json(
        { error: 'Podcast non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(podcast);
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du podcast' },
      { status: 500 }
    );
  }
}

/**
 * Supprime un podcast par son ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Vérifier si le podcast existe
    const podcastIndex = PODCASTS_DB.findIndex(p => p.id === params.id);
    
    if (podcastIndex === -1) {
      return NextResponse.json(
        { error: 'Podcast non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le podcast de notre "base de données"
    PODCASTS_DB.splice(podcastIndex, 1);
    
    return NextResponse.json(
      { message: 'Podcast supprimé avec succès' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du podcast' },
      { status: 500 }
    );
  }
} 