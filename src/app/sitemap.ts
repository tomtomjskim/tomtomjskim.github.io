import type { MetadataRoute } from 'next';
import { getAllCases } from '@/lib/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tomtomjskim.github.io';
  return [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/about/`, changeFrequency: 'monthly', priority: 0.7 },
    ...getAllCases().map((portfolioCase) => ({
      url: `${baseUrl}/cases/${portfolioCase.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }))
  ];
}
