export const rainfallZones = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [44.188, 15.368],
              [44.198, 15.368],
              [44.198, 15.378],
              [44.188, 15.378],
              [44.188, 15.368],
            ],
          ],
        },
        properties: {
          name: "المنطقة الشرقية",
          notes: "معدل أمطار متوسط",
          rainfall_mm: 120,
          month: "مايو",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [44.180, 15.360],
              [44.190, 15.360],
              [44.190, 15.370],
              [44.180, 15.370],
              [44.180, 15.360],
            ],
          ],
        },
        properties: {
          name: "المنطقة الغربية",
          notes: "أمطار غزيرة",
          rainfall_mm: 250,
          month: "مايو",
        },
      },
    ],
  };
  