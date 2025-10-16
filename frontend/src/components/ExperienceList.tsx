import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experiencesAPI } from '../services/api';
import { Experience } from '../types';
import { useAuth } from '../context/AuthContext';
import './ExperienceList.css';

const ExperienceList: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experiencesAPI.getAll();
      setExperiences(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await experiencesAPI.delete(id);
      setExperiences(experiences.filter((exp) => exp.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete experience');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading experiences...</div>;
  }

  return (
    <div className="experience-list-container">
      <header className="app-header">
        <h1>TU Connect - My Stream Experiences</h1>
        <div className="header-actions">
          <span className="user-info">
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="content">
        <div className="actions">
          <button onClick={() => navigate('/experiences/new')} className="add-btn">
            + Log New Experience
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {experiences.length === 0 ? (
          <div className="no-experiences">
            <p>No stream experiences logged yet.</p>
            <p>Click "Log New Experience" to get started!</p>
          </div>
        ) : (
          <div className="experiences-grid">
            {experiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                <h3>{exp.streamName || exp.customStreamName}</h3>
                <p className="location">📍 {exp.location}</p>
                <p className="date">📅 {new Date(exp.date).toLocaleDateString()}</p>
                {exp.weatherCondition && <p className="weather">🌤️ {exp.weatherCondition}</p>}
                {exp.waterCondition && (
                  <p className="water-condition">💧 {exp.waterCondition}</p>
                )}
                {exp.fishCaught !== undefined && exp.fishCaught > 0 && (
                  <p className="fish-caught">🎣 {exp.fishCaught} fish caught</p>
                )}
                {(exp.speciesName || exp.customSpecies) && <p className="species">🐟 {exp.speciesName || exp.customSpecies}</p>}
                {exp.notes && <p className="notes">{exp.notes}</p>}
                <div className="card-actions">
                  <button
                    onClick={() => navigate(`/experiences/edit/${exp.id}`)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id!)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceList;
