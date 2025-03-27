import React from 'react';
import Hero from '../components/Hero';
import FeaturedArtists from '../components/FeaturedArtists';
import Categories from '../components/Categories';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Hero />
    </div>
  );
};

export default Home;