import React, { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { MAPBOX_TOKEN } from "@/lib/constants"

export const ListingMapBoxOld: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Reference to our map div
      style: "mapbox://styles/mapbox/streets-v11", // Map style
      center: [15.9819, 45.815], // Default location: Zagreb, Croatia
      zoom: 10, // Zoom level
    })

    // Add a marker at Zagreb's location
    new mapboxgl.Marker().setLngLat([15.9819, 45.815]).addTo(map)

    return () => map.remove() // Cleanup on unmount
  }, [])

  return <div ref={mapContainerRef} className="w-full h-96 rounded-lg" />
}

const ListingMapBox: React.FC<{ address: string }> = ({ address }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN

    const fetchCoordinates = async () => {
      if (!mapContainerRef.current) return

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_TOKEN}`
      )
      const data = await response.json()

      if (!data.features || data.features.length === 0) {
        console.error("No location found for:", address)
        return
      }

      const [lng, lat] = data.features[0].geometry.coordinates

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 13,
      })

      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)

      return () => map.remove()
    }

    fetchCoordinates()
  }, [address])

  return <div ref={mapContainerRef} className="w-full h-96 rounded-lg" />
}

export default ListingMapBox
