<script setup>
import { auth, url } from "./config/constants";
import { plots, plot_points, savePlot } from "./utils/fetch";
import { addMapSource, addMapPoint, removeNewPlot } from "./utils/map";

mapboxgl.accessToken = auth.access_token_mapbox;
const map = new mapboxgl.Map({
  container: "app",
  style: auth.mapbox_map_style,
  center: plot_points(plots[0])[0],
  zoom: 10,
});

map.on("load", () => {
  const coordinatesBox = [];

  for (let i = 0; i < plots.length; i++) {
    addMapSource(map, `maine-${plots[i].id}`, plot_points(plots[i]));
  }

  map.on("click", (event) => {
    const { lng, lat } = event.lngLat;
    coordinatesBox.push([lng, lat]);

    if (coordinatesBox.length >= 4) {
      coordinatesBox.push(coordinatesBox[0]);
      addMapSource(map, "new-maine", coordinatesBox);

      var coordinates = coordinatesBox[0];
      var button = `
        <button id='new-maine-btn-save'>Сохранить</button>
        <button id='new-maine-btn-del'>Отмена</button>`;
      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(button)
        .addTo(map);

      const btnDel = document.getElementById("new-maine-btn-del");
      const btnSave = document.getElementById("new-maine-btn-save");
      btnDel.addEventListener("click", () => {
        removeNewPlot(map, popup, coordinatesBox);
        coordinatesBox.length = 0;
      });
      btnSave.addEventListener("click", () => {
        savePlot(coordinatesBox).then((data) => {
          if (data.data) {
            removeNewPlot(map, popup, coordinatesBox);
            window.location.reload();
          }
        });
      });
    } else {
      addMapPoint(map, lng, { lng, lat });
    }

    console.log(coordinatesBox);
  });
});
</script>


<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
