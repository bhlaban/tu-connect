import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tripsAPI, lookupsAPI } from '../services/api';
import { TripFormData, LookupData, Catch } from '../types';
import './TripForm.css';

const TripForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<TripFormData>({
    streamId: 0,
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toISOString().split('T')[1],
    stopDate: new Date().toISOString().split('T')[0],
    stopTime: new Date().toISOString().split('T')[1],
    weatherConditionId: undefined,
    waterClarityConditionId: undefined,
    waterLevelConditionId: undefined,
    notes: '',
    catches: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupData, setLookupData] = useState<LookupData>({
    streams: [],
    species: [],
    weatherConditions: [],
    waterClarityConditions: [],
    waterLevelConditions: [],
  });

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
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const trip = await tripsAPI.getById(parseInt(id!));
        
        // Format time values for HTML time input (HH:MM format)
        const formatTime = (timeValue: string | undefined): string => {
          if (!timeValue) return '';
          // Handle various time formats from SQL Server
          // Format: HH:MM:SS or HH:MM:SS.mmm or just HH:MM
          const timeParts = timeValue.split(':');
          if (timeParts.length >= 2) {
            const hours = timeParts[0].padStart(2, '0');
            const minutes = timeParts[1].padStart(2, '0');
            return `${hours}:${minutes}`;
          }
          return '';
        };
        
        setFormData({
          streamId: trip.streamId,
          location: trip.location || '',
          startDate: trip.startDateTime?.split('T')[0] || '',
          stopDate: trip.stopDateTime?.split('T')[0] || '',
          startTime: formatTime(trip.startDateTime?.split('T')[1]),
          stopTime: formatTime(trip.stopDateTime?.split('T')[1]),
          weatherConditionId: trip.weatherConditionId,
          waterClarityConditionId: trip.waterClarityConditionId,
          waterLevelConditionId: trip.waterLevelConditionId,
          notes: trip.notes || '',
          catches: trip.catches || [],
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchTrip();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'streamId' || name === 'weatherConditionId' || name === 'waterClarityConditionId' ||
               name === 'waterLevelConditionId'
        ? (value ? parseInt(value) : undefined)
        : value,
    }));
  };

  const handleAddCatch = () => {
    setFormData((prev) => ({
      ...prev,
      catches: [...prev.catches, { speciesId: 0, length: undefined, notes: '' }],
    }));
  };

  const handleRemoveCatch = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      catches: prev.catches.filter((_, i) => i !== index),
    }));
  };

  const handleCatchChange = (index: number, field: keyof Catch, value: any) => {
    setFormData((prev) => {
      const newCatches = [...prev.catches];
      newCatches[index] = {
        ...newCatches[index],
        [field]: field === 'speciesId' ? parseInt(value) || 0 : 
                 field === 'length' ? (value ? parseFloat(value) : undefined) : value,
      };
      return { ...prev, catches: newCatches };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.streamId) {
      setError('Please select a stream');
      return;
    }

    // Filter out invalid catches
    const validCatches = formData.catches.filter(c => c.speciesId > 0);

    setLoading(true);

    try {
      // Combine date and time into datetime strings (no timezone conversion)
      const startDateTime = formData.startDate && formData.startTime 
        ? `${formData.startDate}T${formData.startTime}:00`
        : formData.startDate 
          ? `${formData.startDate}T00:00:00`
          : '';

      const stopDateTime = formData.stopDate && formData.stopTime
        ? `${formData.stopDate}T${formData.stopTime}:00`
        : '';

      const submitData = {
        streamId: formData.streamId,
        location: formData.location,
        weatherConditionId: formData.weatherConditionId,
        waterClarityConditionId: formData.waterClarityConditionId,
        waterLevelConditionId: formData.waterLevelConditionId,
        notes: formData.notes,
        startDateTime,
        stopDateTime,
        catches: validCatches,
      };

      if (isEditMode) {
        await tripsAPI.update(parseInt(id!), submitData);
      } else {
        await tripsAPI.create(submitData);
      }
      navigate('/trips');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Fishing Trip' : 'Log New Fishing Trip'}</h1>
        <button onClick={() => navigate('/trips')} className="back-btn">
          ← Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="trip-form">
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
                {stream.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location on Stream</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., upstream of HWY T bridge"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stopDate">Stop Date *</label>
            <input
              type="date"
              id="stopDate"
              name="stopDate"
              value={formData.stopDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stopTime">Stop Time *</label>
            <input
              type="time"
              id="stopTime"
              name="stopTime"
              value={formData.stopTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
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
          <label htmlFor="waterClarityConditionId">Water Clarity</label>
          <select
            id="waterClarityConditionId"
            name="waterClarityConditionId"
            value={formData.waterClarityConditionId || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select clarity...</option>
            {lookupData.waterClarityConditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="waterLevelConditionId">Water Level</label>
          <select
            id="waterLevelConditionId"
            name="waterLevelConditionId"
            value={formData.waterLevelConditionId || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select level...</option>
            {lookupData.waterLevelConditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name}
              </option>
            ))}
          </select>
        </div>

        <div className="catches-section">
          <div className="catches-header">
            <h3>Catches</h3>
            <button
              type="button"
              onClick={handleAddCatch}
              className="add-catch-btn"
              disabled={loading}
            >
              + Add Catch
            </button>
          </div>

          {formData.catches.length === 0 ? (
            <p className="no-catches">No catches recorded yet. Click "Add Catch" to log fish.</p>
          ) : (
            <div className="catches-list">
              {formData.catches.map((catchItem, index) => (
                <div key={index} className="catch-item">
                  <div className="catch-fields">
                    <div className="form-group">
                      <label htmlFor={`species-${index}`}>Species *</label>
                      <select
                        id={`species-${index}`}
                        value={catchItem.speciesId}
                        onChange={(e) => handleCatchChange(index, 'speciesId', e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="0">Select species...</option>
                        {lookupData.species.map((species) => (
                          <option key={species.id} value={species.id}>
                            {species.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`length-${index}`}>Length (inches)</label>
                      <input
                        type="number"
                        step="0.5"
                        id={`length-${index}`}
                        value={catchItem.length || ''}
                        onChange={(e) => handleCatchChange(index, 'length', e.target.value)}
                        min="0"
                        disabled={loading}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="form-group catch-notes-field">
                      <label htmlFor={`catch-notes-${index}`}>Notes</label>
                      <input
                        type="text"
                        id={`catch-notes-${index}`}
                        value={catchItem.notes || ''}
                        onChange={(e) => handleCatchChange(index, 'notes', e.target.value)}
                        disabled={loading}
                        placeholder="Optional notes about this catch"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCatch(index)}
                    className="remove-catch-btn"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Trip Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            rows={5}
            placeholder="Any additional notes about your trip..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/trips')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Trip' : 'Log Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
