"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import StoriesCard from "../components/StoriesCard";
import { deletestories, getAllstories } from "../api/CRUD";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [displayedStories, setDisplayedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllstories();
      setStories(data || []);

      const sortedStories = [...(data || [])].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDisplayedStories(sortedStories.slice(0, 6));
    } catch (err) {
      console.error("Error loading stories:", err);
      setError("Failed to load stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    try {
      await deletestories(id);
      setStories((prev) => prev.filter((story) => story.id !== id));
      setDisplayedStories((prev) => prev.filter((story) => story.id !== id));
      toast.success("Story deleted", { position: "top-right" });
    } catch (err) {
      console.error("Error deleting story:", err);
      toast.error("Failed to delete story", { position: "top-right" });
    }
  };

  const handleLoadMore = () => {
    navigate('/stories');
  };

  return (
    <>
      <Helmet>
        <title>New York Lore – Stories from the City That Never Sleeps</title>
        <meta name="description" content="Discover hidden tales, urban legends, and cultural snapshots of New York City." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 text-gray-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-emerald-400 sm:text-4xl sm:tracking-tight lg:text-5xl">
              Welcome To New York Lore
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-300">
              Explore the latest articles, poems and stories.
            </p>
          </div>

          {/* CareDuel Banner */}
          <div className="mt-10">
            <a
              href="https://careduel.com/topic-of-the-week"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gray-100 border-l-4 border-[#FF6F61] text-[#333333] text-[18px] font-[Lora] py-3 px-6 rounded-md hover:underline transition-all"
            >
              Topic of the Week
            </a>
          </div>

          {/* Awards Panels */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://top216.com/vote"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#333333] rounded-[8px] shadow-md p-6 transition-all hover:border-[#FF6F61]"
            >
              <h3 className="text-[20px] font-[Playfair_Display] text-[#333333] flex items-center gap-2">
                🗳️ Vote Top216
              </h3>
            </a>

            <a
              href="https://thetop36.com/highlights"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#333333] rounded-[8px] shadow-md p-6 transition-all hover:border-[#FF6F61]"
            >
              <h3 className="text-[20px] font-[Playfair_Display] text-[#333333] flex items-center gap-2">
                🌟 Explore TheTop36
              </h3>
            </a>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-12 text-center">
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-md mx-auto">
                {error}
              </div>
            </div>
          )}

          {/* Stories Grid */}
          {!loading && !error && (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedStories.length > 0 ? (
                displayedStories.map((story) => (
                  <StoriesCard
                    key={story.id}
                    stories={story}
                    onDelete={deleteStory}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No stories found.</p>
                </div>
              )}
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && stories.length > displayedStories.length && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-emerald-600 text-gray-300 hover:text-emerald-400 font-medium rounded-lg transition-all duration-300"
              >
                Load More Stories
              </button>
            </div>
          )}

          {/* SEO Paragraphs */}
          <section className="mt-16 max-w-3xl mx-auto text-gray-400 text-sm space-y-4 px-4">
            <p>
              From whispered subway secrets to rooftop revelations, New York Lore brings you stories often left untold.
              Dive into the personal, the poetic, and the powerful tales that make this city pulse with life.
            </p>
            <p>
              Each narrative captures the rhythm of the boroughs — stories passed down in barbershops, parks, and fire escapes.
              Whether it’s truth or myth, every word adds to the city’s soul.
            </p>
          </section>
        </main>
      </div>

      <ToastContainer />
    </>
  );
};

export default Home;
