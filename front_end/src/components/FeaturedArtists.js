import React from 'react';

const FeaturedArtists = () => {
  return (
    <div className="featured-artists">
      <h2>Featured Artists</h2>
      <div className="artists-grid">
        {/* Artist cards will be dynamically loaded here */}
        <div className="artist-card">
          <div className="artist-image-placeholder"></div>
          <h3>Coming Soon</h3>
          <p>Featured artists will be showcased here</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtists;