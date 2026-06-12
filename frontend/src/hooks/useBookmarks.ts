import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface BookmarkCollection {
  id: string;
  user_id: string;
  title: string;
  color_class: string;
  bg_class: string;
  created_at: string;
  question_count: number;
}

export interface BookmarkedQuestion {
  bookmark_id: string;
  user_id: string;
  collection_id: string | null;
  bookmarked_at: string;
  question_id: string;
  category: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
}

export function useBookmarks() {
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarksData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Fetch Collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('bookmark_collections_with_counts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (collectionsError) throw collectionsError;

      // Fetch Recent Bookmarks (Uncategorized or all, let's just get the 10 most recent)
      const { data: recentData, error: recentError } = await supabase
        .from('user_bookmarked_questions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('bookmarked_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      setCollections(collectionsData as BookmarkCollection[]);
      setRecentBookmarks(recentData as BookmarkedQuestion[]);
    } catch (err: any) {
      console.error("Failed to load bookmarks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarksData();
  }, []);

  const createCollection = async (title: string, colorClass: string, bgClass: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase.from('bookmark_collections').insert({
      user_id: session.user.id,
      title,
      color_class: colorClass,
      bg_class: bgClass
    });

    if (!error) fetchBookmarksData();
  };

  const toggleBookmark = async (questionId: string, collectionId: string | null = null) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Check if it already exists
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      // Remove it
      await supabase.from('bookmarks').delete().eq('id', existing.id);
    } else {
      // Add it
      await supabase.from('bookmarks').insert({
        user_id: session.user.id,
        question_id: questionId,
        collection_id: collectionId
      });
    }

    fetchBookmarksData();
  };

  return { collections, recentBookmarks, isLoading, error, createCollection, toggleBookmark, fetchBookmarksData };
}
