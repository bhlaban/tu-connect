import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { experiencesAPI, lookupsAPI } from '../services/api';
import { ExperienceFormData, LookupData } from '../types';
import './ExperienceForm.css';

const ExperienceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ExperienceFormData>({
    streamId: undefined,
    customStreamName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    weatherConditionId: undefined,
    waterConditionId: undefined,
    fishCaught: 0,
    speciesId: undefined,
    customSpecies: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupData, setLookupData] = useState<LookupData>({
    streams: [],
    species: [],
    weatherConditions: [],
    waterConditions: [],
  });
  const [useCustomStream, setUseCustomStream] = useState(false);
  const [useCustomSpecies, setUseCustomSpecies] = useState(false);

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const data = await lookupsAPI.getAll();
        setLookupData(data);
      } catch (err: any) {
        console.error('Error loading lookup data:', err);
      }
    };

    fetchLookupData();
  }, []);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const experience = await experiencesAPI.getById(parseInt(id!));
        setFormData({
          streamId: experience.streamId,
          customStreamName: experience.customStreamName || '',
          location: experience.location,
          date: experience.date.split('T')[0],
          weatherConditionId: experience.weatherConditionId,
          waterConditionId: experience.waterConditionId,
          fishCaught: experience.fishCaught || 0,
          speciesId: experience.speciesId,
          customSpecies: experience.customSpecies || '',
          notes: experience.notes || '',
        });
        setUseCustomStream(!!experience.customStreamName);
        setUseCustomSpecies(!!experience.customSpecies);
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
      [name]: name === 'fishCaught' || name === 'streamId' || name === 'speciesId' || name === 'weatherConditionId' || name === 'waterConditionId'
        ? (value ? parseInt(value) : undefined)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clean up data before sending
      const submitData = {
        ...formData,
        streamId: useCustomStream ? undefined : formData.streamId,
        customStreamName: useCustomStream ? formData.customStreamName : undefined,
        speciesId: useCustomSpecies ? undefined : formData.speciesId,
        customSpecies: useCustomSpecies ? formData.customSpecies : undefined,
      };

      if (isEditMode) {
        await experiencesAPI.update(parseInt(id!), submitData);
      } else {
        await experiencesAPI.create(submitData);
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
          <label>
            <input
              type="checkbox"
              checked={useCustomStream}
              onChange={(e) => setUseCustomStream(e.target.checked)}
              disabled={loading}
            />
            {' '}Enter custom stream name
          </label>
        </div>

        {useCustomStream ? (
          <div className="form-group">
            <label htmlFor="customStreamName">Stream Name *</label>
            <input
              type="text"
              id="customStreamName"
              name="customStreamName"
              value={formData.customStreamName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter stream name"
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="streamId">Stream *</label>
            <select
              id="streamId"
              name="streamId"
              value={formData.streamId || ''}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a stream...</option>
              {lookupData.streams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name} {stream.location ? `(${stream.location})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

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
          <label htmlFor="weatherConditionId">Weather Conditions</label>
          <select
            id="weatherConditionId"
            name="weatherConditionId"
            value={formData.weatherConditionId || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select weather...</option>
            {lookupData.weatherConditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="waterConditionId">Water Condition</label>
          <select
            id="waterConditionId"
            name="waterConditionId"
            value={formData.waterConditionId || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select condition...</option>
            {lookupData.waterConditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name}
              </option>
            ))}
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
          <label>
            <input
              type="checkbox"
              checked={useCustomSpecies}
              onChange={(e) => setUseCustomSpecies(e.target.checked)}
              disabled={loading}
            />
            {' '}Enter custom species
          </label>
        </div>

        {useCustomSpecies ? (
          <div className="form-group">
            <label htmlFor="customSpecies">Fish Species</label>
            <input
              type="text"
              id="customSpecies"
              name="customSpecies"
              value={formData.customSpecies}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., Rainbow Trout, Brown Trout"
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="speciesId">Fish Species</label>
            <select
              id="speciesId"
              name="speciesId"
              value={formData.speciesId || ''}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select species...</option>
              {lookupData.species.map((species) => (
                <option key={species.id} value={species.id}>
                  {species.name} {species.scientificName ? `(${species.scientificName})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

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
