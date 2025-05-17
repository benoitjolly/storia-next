'use client';

import { useState } from 'react';
import { initializeApp, getApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

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
  transcript?: string;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = getApp();
} catch {
  firebaseApp = initializeApp(firebaseConfig);
}

/**
 * Hook personnalisé pour interagir avec l'API de podcasts
 */
export const usePodcastAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crée un prompt pour l'IA basé sur les données du formulaire
   */
  const createAIPrompt = (data: PodcastFormData): string => {
    const guestsList = data.guests ? data.guests.split(',').map(guest => guest.trim()).join(', ') : 'aucun invité';
    const topicsList = data.topics ? data.topics.split(',').map(topic => topic.trim()).join(', ') : 'sujet général';
    
    return `Tu dois générer le script complet d'un podcast de ${data.duration} minutes intitulé "${data.title}".

CONTEXTE:
- Catégorie: ${data.category}
- Description: ${data.description}
- Durée cible: ${data.duration} minutes (approximativement ${parseInt(data.duration) * 150} mots)
- Invités: ${guestsList}
- Sujets principaux: ${topicsList}
- Date actuelle: ${new Date().toLocaleDateString('fr-FR')}

CONTENU FACTUEL:
- Utilise des faits et événements réels et récents (dernière année) liés au sujet du podcast.
- Cite des données, statistiques et sources spécifiques (ex: "Selon une étude de [organisation] publiée en [date]...")
- Mentionne des tendances actuelles et événements d'actualité pertinents pour le sujet.
- Si tu mentionnes des entreprises, des produits ou des personnes, utilise des informations précises et vérifiables.
- Pour les sujets économiques ou financiers, inclus des chiffres réels récents (indices boursiers, taux, croissance...).
- Évite les généralités vagues et privilégie les exemples concrets et factuels.

INSTRUCTIONS:
1. Crée un script de podcast complet dans un format de dialogue avec:
   - Un animateur principal nommé Alex
   - Les invités mentionnés ci-dessus (Si aucun invité, tu peux inventer un co-animateur)
   - Des transitions naturelles entre les sujets
   - Une introduction et une conclusion clairement définies

2. Structure:
   - Introduction captivante présentant des faits d'actualité récents (10% du temps)
   - Discussion des sujets principaux avec des exemples concrets et des faits vérifiables (75% du temps)
   - Conclusion résumant les points clés et les sources citées (15% du temps)

3. Style et ton:
   - Ton conversationnel, naturel et engageant
   - Langage accessible mais informatif
   - Humour léger quand approprié
   - Questions pertinentes et réponses détaillées basées sur des faits réels
   - Inclure des anecdotes ou exemples concrets tirés de l'actualité récente

4. Format:
   - Format de script avec les noms des intervenants en début de ligne
   - ALEX: pour l'animateur
   - NOM_INVITÉ: pour chaque invité
   - Inclure des références à l'actualité avec des formulations comme "Comme nous l'avons vu récemment..." ou "Selon les dernières informations..."

Génère un podcast informatif, factuel et qui semble authentique, comme une véritable conversation entre experts s'appuyant sur des données réelles et récentes.`;
  };

  /**
   * Génère un podcast en utilisant Firebase Vertex AI
   */
  const generatePodcastWithVertexAI = async (data: PodcastFormData): Promise<string> => {
    try {
      // Initialize Vertex AI
      const vertexAI = getVertexAI(firebaseApp);
      
      // Create a GenerativeModel instance
      const model = getGenerativeModel(vertexAI, { 
        model: "gemini-2.5-pro-preview-03-25",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.95,
          topK: 40
        }
      });
      
      // Generate the content
      const prompt = createAIPrompt(data);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (err) {
      console.error("Erreur lors de la génération avec Vertex AI:", err);
      
      // Fallback to simulation if Vertex AI fails
      return simulateAIGeneration(data);
    }
  };

  /**
   * Simule la génération d'un podcast avec IA (fallback)
   */
  const simulateAIGeneration = async (data: PodcastFormData): Promise<string> => {
    // Créer le prompt pour référence mais pas utilisé directement dans cette démo
    createAIPrompt(data);
    
    // Simuler un délai pour le traitement IA
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Invités à utiliser dans le script
    const guestNames = data.guests 
      ? data.guests.split(',').map(guest => guest.trim())
      : ['Sophie']; // Invitée par défaut si aucun n'est spécifié
      
    // Identifier la catégorie pour personnaliser le script
    let categorySpecificContent = '';
    switch(data.category) {
      case 'technology':
        categorySpecificContent = `ALEX: Parlons maintenant de l'innovation technologique. Qu'est-ce qui vous fascine le plus dans ce domaine?

${guestNames[0].toUpperCase()}: Je pense que c'est la vitesse à laquelle les technologies évoluent. Il y a dix ans, l'IA n'était pas aussi présente dans notre quotidien, et maintenant elle est partout.

ALEX: C'est vrai, on assiste à une accélération impressionnante. Et concernant ${data.topics || 'les tendances actuelles'}, quel est votre point de vue?`;
        break;
      case 'business':
        categorySpecificContent = `ALEX: Le monde des affaires est en constante évolution. Comment voyez-vous l'impact de ${data.topics || 'la transformation digitale'} sur les entreprises?

${guestNames[0].toUpperCase()}: Les entreprises qui ne s'adaptent pas risquent de disparaître. La digitalisation n'est plus une option mais une nécessité.

ALEX: Exactement. Et selon vous, quelles compétences seront essentielles pour les entrepreneurs de demain?`;
        break;
      default:
        categorySpecificContent = `ALEX: Le domaine de ${data.category} connaît de nombreux bouleversements. Qu'est-ce qui vous semble le plus significatif?

${guestNames[0].toUpperCase()}: Je dirais que c'est la manière dont ${data.topics || 'les nouvelles approches'} transforment complètement notre vision.

ALEX: Tout à fait d'accord. Et comment voyez-vous l'évolution dans les années à venir?`;
    }
    
    // Générer un script de podcast personnalisé
    return `ALEX: Bienvenue à tous dans ce nouvel épisode de notre podcast ! Je suis Alex, votre hôte, et aujourd'hui nous allons parler de ${data.title}. C'est un sujet passionnant qui ${data.description.toLowerCase().includes('qui') ? data.description : 'qui ' + data.description}.

${guestNames.map(name => `${name.toUpperCase()}: Merci Alex, je suis ravi(e) d'être ici aujourd'hui.`).join('\n')}

ALEX: Pour commencer, j'aimerais que nous définissions ce que représente ${data.topics || 'ce sujet'} pour chacun d'entre vous.

${guestNames[0].toUpperCase()}: Pour moi, c'est avant tout une question de perspective et d'innovation. Il faut voir au-delà des approches conventionnelles.

${categorySpecificContent}

${guestNames.length > 1 ? `${guestNames[1].toUpperCase()}: Si je peux ajouter quelque chose, je pense que nous devons également considérer l'aspect éthique de tout cela.

ALEX: Excellente remarque. L'éthique est effectivement un aspect crucial.` : ''}

ALEX: Nous avons couvert beaucoup de sujets intéressants aujourd'hui. Pour conclure, j'aimerais que chacun partage une dernière réflexion.

${guestNames.map(name => `${name.toUpperCase()}: Je dirais simplement que l'avenir est prometteur, mais qu'il faudra rester vigilant et adaptable.`).join('\n')}

ALEX: Merci infiniment pour ces échanges enrichissants. Et merci à vous, chers auditeurs, de nous avoir suivis. N'oubliez pas de vous abonner et de partager ce podcast si vous l'avez apprécié. À très bientôt pour un nouvel épisode !`;
  };

  /**
   * Génère un podcast à partir des données du formulaire
   */
  const generatePodcast = async (data: PodcastFormData): Promise<PodcastResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Étape 1: Générer le contenu avec Vertex AI
      const transcript = await generatePodcastWithVertexAI(data);
      
      // Étape 2: Enregistrer le podcast dans l'API
      const response = await fetch('/api/podcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          transcript: transcript
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du podcast');
      }

      const result = await response.json();
      return {
        ...result,
        transcript: transcript
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère la liste des podcasts générés
   */
  const getPodcasts = async (): Promise<PodcastResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/podcasts');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des podcasts');
      }

      const podcasts = await response.json();
      return podcasts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère un podcast spécifique par son ID
   */
  const getPodcastById = async (id: string): Promise<PodcastResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/podcasts/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération du podcast');
      }

      const podcast = await response.json();
      return podcast;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprime un podcast par son ID
   */
  const deletePodcast = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du podcast');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePodcast,
    getPodcasts,
    getPodcastById,
    deletePodcast,
    isLoading,
    error
  };
};

export default usePodcastAPI; 