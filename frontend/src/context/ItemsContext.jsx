import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiJson } from '../lib/api';

const ItemsContext = createContext();

export const useItems = () => useContext(ItemsContext);

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  const resolveAssetUrl = (assetPath) => {
    if (!assetPath) return '';
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
    if (assetPath.startsWith('/')) return `${baseUrl}${assetPath}`;
    return `${baseUrl}/${assetPath}`;
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await apiJson('/items/');
      if (!res.ok) throw new Error('Failed to fetch items from backend');
      const json = res.data;
      
      // Map backend response shape to frontend expected shape
      const mappedItems = json.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || 'No description provided.',
        category: item.category || 'General',
        location: item.location,
        // Fallback for image: use generic placeholder if null
        image: resolveAssetUrl(item.image) || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&q=80&w=400',
        date: item.created_at ? item.created_at.split('T')[0] : '2024-05-18',
        type: item.report_type === 'lost' ? 'lost' : 'found',
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize
        reporterId: item.reporter_id,
        reporter: `User #${item.reporter_id}`, // Fallback if name is not available
        reporterEmail: `user${item.reporter_id}@apps.ipb.ac.id`, // Fallback for matching
        contactInfo: 'WA: 08123456789' // Fallback contact info
      }));

      // Sort so newest items (highest ID) come first
      mappedItems.sort((a, b) => b.id - a.id);
      setItems(mappedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      // No local mock data fallback: surface empty list so UI reflects backend state
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, loading, refreshItems: fetchItems }}>
      {children}
    </ItemsContext.Provider>
  );
};
