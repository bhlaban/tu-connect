import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
import './TripList.css';

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripsAPI.getAll();
      setTrips(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      await tripsAPI.delete(id);
      setTrips(trips.filter((trip) => trip.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading trips...</div>;
  }

  return (
    <div className="trip-list-container">
      <header className="app-header">
        <h1>TU Connect - My Fishing Trips</h1>
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
          <button onClick={() => navigate('/trips/new')} className="add-btn">
            + Log New Trip
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {trips.length === 0 ? (
          <div className="no-trips">
            <p>No fishing trips logged yet.</p>
            <p>Click "Log New Trip" to get started!</p>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card">
                <h3>{trip.streamName}</h3>
                {trip.location && <p className="trip-location">📍 {trip.location}</p>}
                <p className="date">📅 {trip.date.split('T')[0]}</p>
                {trip.startTime && trip.stopTime && (
                  <p className="time">⏰ {trip.startTime} - {trip.stopTime}</p>
                )}
                {trip.weatherCondition && <p className="weather">🌤️ {trip.weatherCondition}</p>}
                {trip.waterClarityCondition && (
                  <p className="water-clarity">💧 Clarity: {trip.waterClarityCondition}</p>
                )}
                {trip.waterLevelCondition && (
                  <p className="water-level">📊 Level: {trip.waterLevelCondition}</p>
                )}
                {trip.catches && trip.catches.length > 0 && (
                  <div className="catches-section">
                    <p className="catches-header">🎣 Catches ({trip.catches.length}):</p>
                    <ul className="catches-list">
                      {trip.catches.map((catchItem, index) => (
                        <li key={index}>
                          {catchItem.speciesName}
                          {catchItem.length && <span className="catch-length"> - {catchItem.length}"</span>}
                          {catchItem.notes && <span className="catch-notes"> - {catchItem.notes}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trip.notes && <p className="notes">{trip.notes}</p>}
                <div className="card-actions">
                  <button
                    onClick={() => navigate(`/trips/edit/${trip.id}`)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id!)}
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

export default TripList;
