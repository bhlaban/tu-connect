import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { experiencesAPI } from '../services/api';
import { ExperienceFormData } from '../types';
import './ExperienceForm.css';

const ExperienceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ExperienceFormData>({
    streamName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    weather: '',
    waterCondition: '',
    fishCaught: 0,
    species: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const experience = await experiencesAPI.getById(parseInt(id!));
        setFormData({
          streamName: experience.streamName,
          location: experience.location,
          date: experience.date.split('T')[0],
          weather: experience.weather || '',
          waterCondition: experience.waterCondition || '',
          fishCaught: experience.fishCaught || 0,
          species: experience.species || '',
          notes: experience.notes || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchExperience();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'fishCaught' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await experiencesAPI.update(parseInt(id!), formData);
      } else {
        await experiencesAPI.create(formData);
      }
      navigate('/experiences');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Stream Experience' : 'Log New Stream Experience'}</h1>
        <button onClick={() => navigate('/experiences')} className="back-btn">
          ← Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="experience-form">
        <div className="form-group">
          <label htmlFor="streamName">Stream Name *</label>
          <input
            type="text"
            id="streamName"
            name="streamName"
            value={formData.streamName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., Rocky Mountain National Park, CO"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weather">Weather Conditions</label>
          <select
            id="weather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select weather...</option>
            <option value="Sunny">Sunny</option>
            <option value="Partly Cloudy">Partly Cloudy</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Rainy">Rainy</option>
            <option value="Stormy">Stormy</option>
            <option value="Foggy">Foggy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="waterCondition">Water Condition</label>
          <select
            id="waterCondition"
            name="waterCondition"
            value={formData.waterCondition}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select condition...</option>
            <option value="Clear">Clear</option>
            <option value="Slightly Murky">Slightly Murky</option>
            <option value="Murky">Murky</option>
            <option value="High Flow">High Flow</option>
            <option value="Low Flow">Low Flow</option>
            <option value="Normal Flow">Normal Flow</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fishCaught">Number of Fish Caught</label>
          <input
            type="number"
            id="fishCaught"
            name="fishCaught"
            value={formData.fishCaught}
            onChange={handleChange}
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="species">Fish Species</label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., Rainbow Trout, Brown Trout"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            rows={5}
            placeholder="Any additional notes about your experience..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/experiences')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Experience' : 'Log Experience'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
