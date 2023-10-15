export function addMapSource(map, id_source, coordinates) {
  map.addSource(`${id_source}`, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    },
  });

  map.addLayer({
    id: `${id_source}`,
    type: "fill",
    source: `${id_source}`,
    layout: {},
    paint: {
      "fill-color": "#0080ff",
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
    id: `outline-${id_source}`,
    type: "line",
    source: `${id_source}`,
    layout: {},
    paint: {
      "line-color": "white",
      "line-width": 3,
    },
  });
}

export function delMapSource(map, id_source) {}

export function addMapPoint(map, id, coordinates) {
  const { lng, lat } = coordinates;
  map.addLayer({
    id: `point-${id}`,
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        ],
      },
    },
    paint: {
      "circle-radius": 3,
      "circle-color": "white",
    },
  });
}

export function removeNewPlot(map, popup, points_coordinates) {
  // remove fill

  map.removeLayer("new-maine");

  // remove outline

  map.removeLayer("outline-new-maine");

  // remove points

  for (let i = 0; i < points_coordinates.length - 2; i++) {
    const element = points_coordinates[i];
    map.removeLayer(`point-${element[0]}`);
  }

  map.removeSource("new-maine");
  popup.remove();
}
