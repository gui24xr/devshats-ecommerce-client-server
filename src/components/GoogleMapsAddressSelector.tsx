"use client";
import { useState, useCallback, useRef, useEffect } from "react";

const GoogleMapsAddressSelector = ({ onAddressSelect, apiKey, centerCoordinates }) => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const center = centerCoordinates || { lat: -34.603722, lng: -58.381592 }; // Buenos Aires

  // Cargar Google Maps API
  useEffect(() => {
    if (!apiKey) {
      setError("API Key es requerida");
      return;
    }

    // Verificar si ya está cargado
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Cargar script de Google Maps
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Callback global para cuando se cargue la API
    window.initMap = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("Error al cargar Google Maps API. Verifica tu API Key.");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.initMap;
    };
  }, [apiKey]);

  // Inicializar mapa cuando la API esté cargada
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      // Crear mapa
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Crear marcador
      const markerInstance = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
      });

      // Crear autocomplete
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          componentRestrictions: { country: "ar" }, // Solo Argentina
          fields: [
            "formatted_address",
            "geometry",
            "place_id",
            "address_components",
            "types",
          ],
        }
      );

      setMap(mapInstance);
      setMarker(markerInstance);
      setAutocomplete(autocompleteInstance);

      // Event listeners
      setupEventListeners(mapInstance, markerInstance, autocompleteInstance);
    } catch (err) {
      setError("Error al inicializar Google Maps: " + err.message);
    }
  }, [isLoaded]);

  const setupEventListeners = (
    mapInstance,
    markerInstance,
    autocompleteInstance
  ) => {
    // Cuando se selecciona un lugar del autocomplete
    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();

      if (!place.geometry) {
        setError("No se encontraron detalles para esta dirección");
        return;
      }

      const location = place.geometry.location;
      const addressData = {
        address: place.formatted_address,
        coordinates: {
          lat: location.lat(),
          lng: location.lng(),
        },
        placeId: place.place_id,
        types: place.types,
        addressComponents: place.address_components,
      };

      // Actualizar mapa y marcador
      mapInstance.setCenter(location);
      mapInstance.setZoom(16);
      markerInstance.setPosition(location);

      setSelectedPlace(addressData);
      onAddressSelect?.(addressData);
    });

    // Cuando se hace clic en el mapa
    mapInstance.addListener("click", (event) => {
      const location = event.latLng;
      markerInstance.setPosition(location);

      // Geocodificación inversa
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const addressData = {
            address: results[0].formatted_address,
            coordinates: {
              lat: location.lat(),
              lng: location.lng(),
            },
            placeId: results[0].place_id,
            types: results[0].types,
            addressComponents: results[0].address_components,
          };

          setSelectedPlace(addressData);
          onAddressSelect?.(addressData);

          // Actualizar input
          if (autocompleteRef.current) {
            autocompleteRef.current.value = results[0].formatted_address;
          }
        }
      });
    });

    // Cuando se arrastra el marcador
    markerInstance.addListener("dragend", (event) => {
      const location = event.latLng;

      // Geocodificación inversa
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const addressData = {
            address: results[0].formatted_address,
            coordinates: {
              lat: location.lat(),
              lng: location.lng(),
            },
            placeId: results[0].place_id,
            types: results[0].types,
            addressComponents: results[0].address_components,
          };

          setSelectedPlace(addressData);
          onAddressSelect?.(addressData);

          // Actualizar input
          if (autocompleteRef.current) {
            autocompleteRef.current.value = results[0].formatted_address;
          }
        }
      });
    });
  };

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-700">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold">Error:</span>
        </div>
        <p className="mt-2 text-red-600">{error}</p>
        <div className="mt-3 text-sm text-red-500">
          <p>Verifica que:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Tu API Key sea válida</li>
            <li>
              Tengas habilitadas las APIs: Maps JavaScript API y Places API
            </li>
            <li>Tu API Key tenga permisos para este dominio</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-center text-gray-500">
          <svg
            className="animate-spin w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            ></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            ></path>
          </svg>
          Cargando Google Maps...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Input con autocompletado */}
      <div className="relative">
        <input
          ref={autocompleteRef}
          type="text"
          placeholder="Buscar dirección..."
          className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ minHeight: "400px" }}
      />

      {/* Información de la ubicación seleccionada 
      {selectedPlace && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ubicación seleccionada:
          </h3>
          <p className="text-blue-700 text-sm mb-2">{selectedPlace.address}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-600">
            <span className="font-mono">Lat: {selectedPlace.coordinates.lat.toFixed(6)}</span>
            <span className="font-mono">Lng: {selectedPlace.coordinates.lng.toFixed(6)}</span>
          </div>
          <div className="mt-2 text-xs text-blue-500">
            Place ID: {selectedPlace.placeId}
          </div>
        </div>
      )}
        */}

      {/* Instrucciones */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Cómo usar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Escribe en el campo de búsqueda para autocompletado</li>
          <li>Haz clic en el mapa para seleccionar una ubicación</li>
          <li>Arrastra el marcador para ajustar la posición</li>
        </ul>
      </div>
    </div>
  );
};

// Componente principal de ejemplo
function GoogleMapsExample() {
  const [selectedAddress, setSelectedAddress] = useState(null);

  // API Key desde variables de entorno
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY;

  const handleAddressSelect = (addressData) => {
    console.log("Dirección seleccionada:", addressData);
    setSelectedAddress(addressData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Google Maps con Autocompletado
        </h1>
        <p className="text-gray-600">Componente real con Google Maps API</p>
      </div>

      {/* Mostrar advertencia si no hay API key */}
      {GOOGLE_MAPS_API_KEY === process.env.NEXT_PUBLIC_GMAPS_API_KEY && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-semibold">Configuración requerida:</span>
          </div>
          <p className="mt-2 text-yellow-600">
            Reemplaza{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              'TU_API_KEY_AQUI'
            </code>{" "}
            con tu API Key de Google Maps
          </p>
        </div>
      )}

      <GoogleMapsAddressSelector
        apiKey={GOOGLE_MAPS_API_KEY}
        onAddressSelect={handleAddressSelect}
      />

      {selectedAddress && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Datos capturados:</h3>
          <pre className="text-sm text-gray-600 bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(selectedAddress, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AddressMapSelector({ onAddressSelect, centerCoordinates }) {
  const [selectedAddress, setSelectedAddress] = useState(null);

  // API Key desde variables de entorno
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY;

  const handleAddressSelect = (addressData) => {
    setSelectedAddress(addressData);
  };

  const handleClick = () => {
    onAddressSelect(selectedAddress);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Ubicacion de entrega
        </h1>
        <p className="text-gray-600">
          {" "}
          Selecciona la ubicacion de entrega y luego validar la ubicacion.
        </p>
      </div>

      <GoogleMapsAddressSelector
        apiKey={GOOGLE_MAPS_API_KEY}
        onAddressSelect={handleAddressSelect}
        centerCoordinates={centerCoordinates}
      />

      <button
        type="button"
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Validar ubicacion
      </button>
    </div>
  );
}
