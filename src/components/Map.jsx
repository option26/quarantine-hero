import React, { useState, useRef } from "react"
import fb from "../firebase";
import GoogleMapReact from "google-map-react";
import "../styles/Map.css";
import useSupercluster from "use-supercluster";

import Entry from "./Entry";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_ZOOM_LEVEL = 6

const Marker = ({ children }) => children;

export default function Map() {
  const mapRef = useRef();

  const { t } = useTranslation();

  const [zoom, setZoom] = useState(DEFAULT_ZOOM_LEVEL);
  const [bounds, setBounds] = useState(null);

  const [selectedHelpRequests, setSelectedHelpRequests] = useState([])

  const [lastSelectedMarkerId, setLastSelectedMarkerId] = useState()

  const [entries, setEntries] = useState([])

  useEffect(() => {
    const fetchEntries = async () => {

      const queryResult = await fb.store.collection("ask-for-help").get()
      
      const entries = queryResult.docs
        .map(document => ({ ...document.data().d, id: document.id }))
        .map(dataPoint => ({
          type: "Feature",
          properties: {
            ...dataPoint,
            cluster: false
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(dataPoint.coordinates.longitude),
              parseFloat(dataPoint.coordinates.latitude)
            ]
          }
        }));
  
      setEntries(entries)
    }

    fetchEntries()    
  }, [])

  

  const { clusters, supercluster } = useSupercluster({
    points: entries,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 23 }
  });

  console.log(clusters)
  console.log(supercluster)


  return (
    <div>
      <p className="font-open-sans font-hairline text-s italic mb-3">
        {t("components.map.hint")}
      </p>
      <div className="my-3" style={{ height: "750px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "/* YOUR KEY HERE */" }}
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
          }}
          defaultCenter={{
            lat: 51.1888907,
            lng: 9.5866037
          }}
          defaultZoom={DEFAULT_ZOOM_LEVEL}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat
            ]);
          }}
        >
          {clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount
            } = cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  lat={latitude}
                  lng={longitude}
                >
                  <div
                    className={`cluster-marker ${
                      lastSelectedMarkerId === cluster.id ? "cm-selected" : ""
                    }`}
                    style={{
                      width: `${10 + (pointCount / entries.length) * 20}px`,
                      height: `${10 + (pointCount / entries.length) * 20}px`
                    }}
                    onClick={() => {
                      setLastSelectedMarkerId(cluster.id);
                      const leaves = supercluster.getLeaves(
                        cluster.id,
                        Infinity
                      );
                      setSelectedHelpRequests(
                        leaves.map(leaf => leaf.properties)
                      );
                    }}
                  >
                    <p className="font-open-sans">{pointCount}</p>
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={`helpRequest-${cluster.properties.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className={`help-request-marker ${
                    lastSelectedMarkerId === cluster.properties.id
                      ? "hrm-selected"
                      : ""
                  }`}
                  style={{
                    width: `${10 + (pointCount / entries.length) * 20}px`,
                    height: `${10 + (pointCount / entries.length) * 20}px`
                  }}
                  onClick={() => {
                    setLastSelectedMarkerId(cluster.properties.id);
                    setSelectedHelpRequests([cluster.properties]);
                  }}
                >
                  <img
                    className="help-request-image"
                    alt="help-marker"
                    src={require("../assets/need_help.png")}
                  />
                </div>
              </Marker>
            );
          })}
        </GoogleMapReact>
      </div>
      <strong className="font-open-sans">
        {t("components.map.requestsInSelectedRegion", {
          count: selectedHelpRequests.length
        })}
      </strong>
      {selectedHelpRequests.length === 0 ? (
        <p className="font-open-sans">
          {t("components.map.selectARegionFirst")}
        </p>
      ) : (
        selectedHelpRequests.map(entry => {
          return <Entry key={entry.id} {...entry} />;
        })
      )}
    </div>
  );
}
