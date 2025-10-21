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
                {trip.startDateTime && (() => {
                  // Convert UTC time to local time for display
                  const startUTC = new Date(trip.startDateTime + (trip.startDateTime.includes('Z') ? '' : 'Z'));
                  // JavaScript Date object automatically converts UTC to local time when accessing date/time methods
                  
                  // Format date as mm/dd/yyyy
                  const day = String(startUTC.getDate()).padStart(2, '0');
                  const month = String(startUTC.getMonth() + 1).padStart(2, '0');
                  const year = startUTC.getFullYear();
                  const formattedDate = `${month}/${day}/${year}`;
                  
                  return <p className="date">📅 {formattedDate}</p>;
                })()}
                {trip.startDateTime && trip.stopDateTime && (() => {
                  // Convert UTC times to local times for display  
                  const startUTC = new Date(trip.startDateTime + (trip.startDateTime.includes('Z') ? '' : 'Z'));
                  const stopUTC = new Date(trip.stopDateTime + (trip.stopDateTime.includes('Z') ? '' : 'Z'));
                  // JavaScript Date object automatically converts UTC to local time when accessing date/time methods
                  
                  // Format times in 12-hour AM/PM format
                  const formatTime12Hour = (date: Date) => {
                    let hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // 0 should be 12
                    return `${hours}:${minutes} ${ampm}`;
                  };
                  
                  const startTime = formatTime12Hour(startUTC);
                  const stopTime = formatTime12Hour(stopUTC);
                  
                  // Format dates in mm/dd/yyyy format
                  const formatDate = (date: Date) => {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}/${day}/${year}`;
                  };
                  
                  const startDate = formatDate(startUTC);
                  const stopDate = formatDate(stopUTC);
                  
                  return (
                    <p className="time">
                      ⏰ {startTime} - {stopTime}
                      {startDate !== stopDate && ` (${stopDate})`}
                    </p>
                  );
                })()}
                {trip.weatherCondition && <p className="weather">🌤️ Weather: {trip.weatherCondition}</p>}
                {trip.waterClarityCondition && (
                  <p className="water-clarity">💧 Water Clarity: {trip.waterClarityCondition}</p>
                )}
                {trip.waterLevelCondition && (
                  <p className="water-level">📊 Water Level: {trip.waterLevelCondition}</p>
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
