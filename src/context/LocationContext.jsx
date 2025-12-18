import React, { createContext, useContext, useState, useEffect } from 'react';
import { locationsAPI } from '../services/api';

const LocationContext = createContext();

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [availableLocations, setAvailableLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // Load locations from API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await locationsAPI.getActiveLocations();
                if (response.success) {
                    setAvailableLocations(response.data);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Load selected location from localStorage on mount
    useEffect(() => {
        const storedLocation = localStorage.getItem('selectedLocation');
        if (storedLocation) {
            try {
                setSelectedLocation(JSON.parse(storedLocation));
            } catch (error) {
                console.error('Error parsing stored location:', error);
                localStorage.removeItem('selectedLocation');
            }
        }
    }, []);

    // Save selected location to localStorage whenever it changes
    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        if (location) {
            localStorage.setItem('selectedLocation', JSON.stringify(location));
        } else {
            localStorage.removeItem('selectedLocation');
        }
        setIsLocationModalOpen(false);
    };

    const openLocationModal = () => {
        setIsLocationModalOpen(true);
    };

    const closeLocationModal = () => {
        setIsLocationModalOpen(false);
    };

    const value = {
        selectedLocation,
        setSelectedLocation: handleLocationChange,
        availableLocations,
        isLoading,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationContext;
