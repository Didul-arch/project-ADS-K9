import React, { createContext, useState, useContext, useEffect } from 'react';
import { items as staticMockItems } from '../data/mockData';

const ItemsContext = createContext();

export const useItems = () => useContext(ItemsContext);

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/items/');
      if (!response.ok) throw new Error('Failed to fetch items from backend');
      const json = await response.json();
      
      // Map backend response shape to frontend expected shape
      const mappedItems = json.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || 'No description provided.',
        category: 'General', // Fallback, backend doesn't have category yet
        location: item.location,
        // Fallback for image: use generic placeholder if null
        image: item.image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&q=80&w=400',
        date: item.created_at ? item.created_at.split('T')[0] : '2024-05-18',
        type: item.report_type === 'lost' ? 'lost' : 'found',
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize
        reporterId: item.reporter_id,
        reporter: `User #${item.reporter_id}`, // Fallback if name is not available
        reporterEmail: `user${item.reporter_id}@apps.ipb.ac.id`, // Fallback for matching
        contactInfo: 'WA: 08123456789' // Fallback contact info
      }));

      // In case we still want to show premium mock items for better initial UI
      // We can combine them!
      const allCombined = [...mappedItems, ...staticMockItems.filter(m => !mappedItems.find(mi => mi.title === m.title))];
      
      // Sort so newest items (highest ID) come first
      allCombined.sort((a, b) => b.id - a.id);

      setItems(allCombined);
    } catch (error) {
      console.error("Error fetching items:", error);
      // Fallback to static mock data if backend is unreachable
      setItems(staticMockItems);
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
