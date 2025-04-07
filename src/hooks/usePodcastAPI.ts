'use client';

import { useState } from 'react';

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

/**
 * Hook personnalisé pour interagir avec l'API de podcasts
 */
export const usePodcastAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Génère un podcast à partir des données du formulaire
   * en utilisant l'API REST
   */
  const generatePodcast = async (data: PodcastFormData): Promise<PodcastResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/podcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du podcast');
      }

      const result = await response.json();
      return result;
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