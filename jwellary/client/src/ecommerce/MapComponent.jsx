// // MapComponent.jsx
// import React, { useEffect, useRef } from "react";
// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// // Load API key and map ID from .env
// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

// const containerStyle = {
//   width: "100%",
//   height: "250px",
// };

// const defaultCenter = {
//   lat: 25.276987,
//   lng: 55.296249,
// };

// const MapComponent = ({ onLocationSelect }) => {
//   const mapRef = useRef(null);

//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     mapIds: [MAP_ID], // ✅ Pass Map ID
//     libraries: [], // Static empty array (avoid re-render warning)
//   });

//   useEffect(() => {
//     if (isLoaded && mapRef.current) {
//       const map = mapRef.current;
//       map.addListener("click", (e) => {
//         const lat = e.latLng.lat();
//         const lng = e.latLng.lng();
//         onLocationSelect({ lat, lng });
//       });
//     }
//   }, [isLoaded, onLocationSelect]);

//   if (loadError) {
//     return <div>Error loading map: {loadError.message}</div>;
//   }

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={defaultCenter}
//       zoom={10}
//       mapId={MAP_ID} // ✅ Attach Map ID
//       onLoad={(map) => {
//         mapRef.current = map;
//       }}
//     />
//   ) : (
//     <div>Loading Map...</div>
//   );
// };

// export default React.memo(MapComponent);
