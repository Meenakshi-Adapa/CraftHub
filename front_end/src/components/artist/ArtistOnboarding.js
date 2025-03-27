import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [artistInfo, setArtistInfo] = useState({
    artForm: '',
    experience: '',
    sellProducts: false,
    teachWorkshops: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to update user profile as artist
      navigate('/artist/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Artist!</h2>
          <p className="mt-2 text-gray-600">Let's set up your artist profile</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">What type of art do you create?</h3>
            <select
              value={artistInfo.artForm}
              onChange={(e) => setArtistInfo({ ...artistInfo, artForm: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select your art form</option>
              <option value="madhubani">Madhubani Painting</option>
              <option value="warli">Warli Art</option>
              <option value="pottery">Pottery</option>
              <option value="weaving">Traditional Weaving</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Would you like to:</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={artistInfo.sellProducts}
                  onChange={(e) => setArtistInfo({ ...artistInfo, sellProducts: e.target.checked })}
                  className="h-5 w-5 text-orange-600"
                />
                <span>Sell your artwork on our platform</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={artistInfo.teachWorkshops}
                  onChange={(e) => setArtistInfo({ ...artistInfo, teachWorkshops: e.target.checked })}
                  className="h-5 w-5 text-orange-600"
                />
                <span>Conduct workshops and teach your art</span>
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistOnboarding;