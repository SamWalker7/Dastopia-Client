<!DOCTYPE html>
<html>
  <head>
    <title>Photorealistic 3D Maps in Maps JavaScript Polyline Demo</title>
    <style>
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      gmp-map-3d {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <gmp-map-3d
      heading="25"
      range="2500"
      tilt="45"
      center="24.7136,46.6753,165"
      <!--
      Centered
      on
      Riyadh
      --
    >
      mapTypeId="satellite"
      <!-- Set to satellite view -->
      >
      <gmp-polyline-3d
        altitude-mode="relative-to-ground"
        stroke-color="rgba(25, 102, 210, 0.75)"
        stroke-width="10"
      ></gmp-polyline-3d>
    </gmp-map-3d>

    <script
      async
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4&v=alpha&libraries=maps3d"
    ></script>

    <script>
      const polyline = document.querySelector("gmp-polyline-3d");

      customElements.whenDefined(polyline.localName).then(() => {
        polyline.coordinates = [
          // Add more road lines with coordinates around Riyadh
          { lat: 24.7136, lng: 46.6753 }, // Center point (Riyadh)
          { lat: 24.715, lng: 46.679 },
          { lat: 24.72, lng: 46.685 },
          { lat: 24.725, lng: 46.69 },
          { lat: 24.73, lng: 46.693 },
          { lat: 24.735, lng: 46.695 },
          { lat: 24.74, lng: 46.698 },
          { lat: 24.745, lng: 46.7 },
          { lat: 24.75, lng: 46.702 },
          { lat: 24.755, lng: 46.704 },
          { lat: 24.76, lng: 46.706 },
          { lat: 24.765, lng: 46.708 },
        ];
      });
    </script>
  </body>
</html>
