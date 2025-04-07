'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { usePodcastAPI } from '@/hooks/usePodcastAPI';

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

const initialFormData: PodcastFormData = {
  title: '',
  description: '',
  category: 'technology',
  duration: '30',
  guests: '',
  topics: '',
};

export default function GenerePodcastPage() {
  const [formData, setFormData] = useState<PodcastFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [podcastResult, setPodcastResult] = useState<PodcastResult | null>(null);
  
  const { generatePodcast, isLoading, error } = usePodcastAPI();

  // Simuler la progression
  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 500);
    return interval;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGenerationStatus('Préparation de la génération...');
    setProgress(0);
    setPodcastResult(null);
    
    const progressInterval = simulateProgress();
    
    try {
      // Appel à notre API REST fictive
      const result = await generatePodcast(formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGenerationStatus('Podcast généré avec succès !');
      setPodcastResult(result);
    } catch {
      clearInterval(progressInterval);
      setGenerationStatus(`Erreur: ${error || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setGenerationStatus(null);
    setProgress(0);
    setPodcastResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Générateur de Podcast</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du podcast
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="technology">Technologie</option>
                      <option value="business">Business</option>
                      <option value="science">Science</option>
                      <option value="health">Santé</option>
                      <option value="culture">Culture</option>
                      <option value="entertainment">Divertissement</option>
                      <option value="education">Éducation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Durée (minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="5"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      Invités (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: John Doe, Jane Smith"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">
                      Sujets principaux (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      id="topics"
                      name="topics"
                      value={formData.topics}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: IA, développement durable"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting || isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Génération en cours...' : 'Générer le podcast'}
                </button>
              </div>
            </form>
          </div>
          
          {generationStatus && (
            <div className="mb-6">
              <div className={`p-4 rounded-md ${
                generationStatus.includes('succès') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : generationStatus.includes('Erreur') 
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                <p className="text-sm font-medium">{generationStatus}</p>
              </div>
              
              {isSubmitting && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{progress}% terminé</p>
                </div>
              )}
            </div>
          )}
          
          {podcastResult && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Podcast généré avec succès !</h2>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Titre:</span>
                    <span className="text-sm text-gray-900">{podcastResult.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Durée:</span>
                    <span className="text-sm text-gray-900">{podcastResult.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Format:</span>
                    <span className="text-sm text-gray-900">{podcastResult.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Date de création:</span>
                    <span className="text-sm text-gray-900">{new Date(podcastResult.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a 
                    href={podcastResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-center"
                  >
                    Télécharger le podcast
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Comment ça marche ?</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Remplissez le formulaire avec les détails de votre podcast</li>
              <li>Cliquez sur &quot;Générer le podcast&quot; pour lancer le processus</li>
              <li>Notre API analyse vos informations et génère un podcast personnalisé</li>
              <li>Une fois terminé, vous pourrez télécharger votre podcast</li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">Note: Cette fonctionnalité est une démonstration. Dans une application réelle, le podcast serait généré par une IA et livré sous forme de fichier audio.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 