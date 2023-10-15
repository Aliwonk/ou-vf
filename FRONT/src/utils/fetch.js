import { auth, url } from "../config/constants";

export const plots = await (async function getPlots() {
  const res = await fetch(`${url.api.plot}?populate=*`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${auth.token_stripe}`,
    },
  });
  const data = await res.json();
  return data.data;
})();

export const plot_points = function (plot) {
  const points_data = plot.attributes.plot_points.data;
  const points = points_data.map((data) => {
    return [data.attributes["longitude"], data.attributes["latitude"]];
  });
  return points;
};

export async function savePlotPoints(coordinates) {
  if (coordinates.length >= 4) {
    const idPlots = [];
    for (let i = 0; i < coordinates.length; i++) {
      const response = await fetch(url.api.plot_point, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${auth.token_stripe}`,
        },
        body: JSON.stringify({
          data: {
            longitude: coordinates[i][0],
            latitude: coordinates[i][1],
          },
        }),
      });

      const data = await response.json();
      idPlots.push(data.data.id);
    }

    return idPlots;
  }
}

export async function savePlot(coordinates) {
  const plot_points = await savePlotPoints(coordinates);
  const response = await fetch(url.api.plot, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${auth.token_stripe}`,
    },
    body: JSON.stringify({
      data: {
        level: 1,
        plot_points,
      },
    }),
  });
  const data = await response.json();
  return data;
}
