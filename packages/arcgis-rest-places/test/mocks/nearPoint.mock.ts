export const placeNearPointMockMoreResults = {
  results: [
    {
      placeId: "aae8bed68a327a4903fdf83577b87286",
      location: {
        x: -3.188328,
        y: 55.953245
      },
      categories: [
        {
          categoryId: "18021",
          label: "Gym and Studio"
        }
      ],
      name: "The Gym",
      distance: 6.4
    },
    {
      placeId: "8db5d5f8a92c21fea7fc34f3e7ad8725",
      location: {
        x: -3.188223,
        y: 55.95325
      },
      categories: [
        {
          categoryId: "11124",
          label: "Office"
        }
      ],
      name: "Creative Scotland",
      distance: 7.3
    },
    {
      placeId: "6f729ff511f2e18f4ee97615cf6d5dea",
      location: {
        x: -3.188432,
        y: 55.95324
      },
      categories: [
        {
          categoryId: "10027",
          label: "Museum"
        }
      ],
      name: "Museums Galleries Scotland",
      distance: 10.6
    },
    {
      placeId: "628d6995be9f7104820257cd6ca62c19",
      location: {
        x: -3.18812,
        y: 55.953412
      },
      categories: [
        {
          categoryId: "19029",
          label: "Tour Provider"
        }
      ],
      name: "Rabbie's",
      distance: 16.7
    },
    {
      placeId: "ef102fc711be9e5b402c0054a33dffbe",
      location: {
        x: -3.18812,
        y: 55.953412
      },
      categories: [
        {
          categoryId: "11000",
          label: "Business and Professional Services"
        }
      ],
      name: "Microsoft",
      distance: 16.7
    },
    {
      placeId: "16d4b3f3b43fd8c642c117311ed3f09e",
      location: {
        x: -3.188083,
        y: 55.953152
      },
      categories: [
        {
          categoryId: "16000",
          label: "Landmarks and Outdoors"
        }
      ],
      name: "Neist Point",
      distance: 21.3
    },
    {
      placeId: "2e6df2ccbaec5070729cde83475eac5b",
      location: {
        x: -3.188083,
        y: 55.953152
      },
      categories: [
        {
          categoryId: "16026",
          label: "Monument"
        }
      ],
      name: "Statue of David Hume",
      distance: 21.3
    },
    {
      placeId: "a39ebe2df9d84f0561946b779975ef92",
      location: {
        x: -3.188083,
        y: 55.953152
      },
      categories: [
        {
          categoryId: "11053",
          label: "Financial Planner"
        }
      ],
      name: "Scottish Friendly",
      distance: 21.3
    },
    {
      placeId: "0731478b7b687e0ad9a51ab531e47596",
      location: {
        x: -3.188016,
        y: 55.953417
      },
      categories: [
        {
          categoryId: "12009",
          label: "Education"
        }
      ],
      name: "British Council Scotland",
      distance: 21.9
    },
    {
      placeId: "57c6520c3a2ce8ef251122f447b1f321",
      location: {
        x: -3.188641,
        y: 55.95323
      },
      categories: [
        {
          categoryId: "11124",
          label: "Office"
        }
      ],
      name: "Waverley Gate",
      distance: 22.6
    }
  ],
  maxResultsExceeded: true,
  links: {
    base: "https://placesdev-api.arcgis.com/",
    next: "/arcgis/rest/services/places-service/v1/places/near-point?x=-3.18830000&y=55.95330000&radius=100.00000000&f=json&offset=10&pageSize=10"
  }
};

export const placeNearPointMockNoMoreResults = {
  results: [
    {
      placeId: "aae8bed68a327a4903fdf83577b87286",
      location: {
        x: -3.188328,
        y: 55.953245
      },
      categories: [
        {
          categoryId: "18021",
          label: "Gym and Studio"
        }
      ],
      name: "The Gym",
      distance: 6.4
    }
  ],
  maxResultsExceeded: false,
  pagination: {
    previousUrl:
      "https://placesdev-api.arcgis.com/arcgis/rest/services/places-service/v1/places/near-point?x=-3.18830000&y=55.95330000&radius=100.00000000&f=json&offset=0&pageSize=10"
  }
};
