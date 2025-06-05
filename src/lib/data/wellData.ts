export const groundwaterWells = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [44.1910, 15.3694],
        },
        properties: {
          id: "WELL-001",
          name: "بئر النور",
          description: "بئر ماء يستخدم للشرب والزراعة.",
          level: "12.5 م",
          quality: "good",
          last_measured: "2024-05-01",
          image: "/images/well-1.jpg",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [44.1950, 15.3710],
        },
        properties: {
          id: "WELL-002",
          name: "بئر الحكمة",
          description: "بئر قديم مهدد بالجفاف.",
          level: "6.8 م",
          quality: "poor",
          risk: "مرتفع",
          last_measured: "2024-04-28",
          image: "/images/well-2.jpg",
        },
      },
    ],
  };
  