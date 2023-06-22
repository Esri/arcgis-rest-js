export const placesWithinExtentMockMoreResults = {
  results: [
    {
      place: {
        placeId: "6eb039fa6c292d431b370f8ff9182955",
        location: {
          x: -118.001355,
          y: 33.802582
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          },
          {
            categoryId: "13043",
            label: "Donut Shop"
          },
          {
            categoryId: "13065",
            label: "Restaurant"
          }
        ],
        name: "Donut King and Water",
        parentPlaceId: null as null | string
      }
    },
    {
      place: {
        placeId: "c602ca8f1010f95618c231046dbef3f6",
        location: {
          x: -118.001474,
          y: 33.831752
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          }
        ],
        name: "Tlaxcala Bakery",
        parentPlaceId: null
      }
    },
    {
      place: {
        placeId: "188ab43b2bec75c6e4f6d5df10afc003",
        location: {
          x: -118.008796,
          y: 33.81685
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          }
        ],
        name: "Maxs Baked Goods",
        parentPlaceId: null
      }
    },
    {
      place: {
        placeId: "941ffcd55a06d1e0d509d11da5b32b25",
        location: {
          x: -118.012663,
          y: 33.802565
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          },
          {
            categoryId: "13039",
            label: "Deli"
          },
          {
            categoryId: "13334",
            label: "Sandwich Restaurant"
          }
        ],
        name: "Joe's Deli & Gourmet Sandwiches",
        parentPlaceId: null
      }
    },
    {
      place: {
        placeId: "c82393e528e1f38ed3953c995f6cb62e",
        location: {
          x: -118.008363,
          y: 33.803276
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          },
          {
            categoryId: "13040",
            label: "Dessert Shop"
          },
          {
            categoryId: "13065",
            label: "Restaurant"
          }
        ],
        name: "Kelley's Kookies",
        parentPlaceId: null
      }
    }
  ],
  maxResultsExceeded: true,
  links: {
    base: "https://places-service.esri.com/",
    next: "/rest/v1/world/places/within-extent?xmin=-118.01333400&ymin=33.78193000&xmax=-117.79575300&ymax=33.87333700&categoryIds=13002&f=json&offset=5&pageSize=5&token=AAPK7d4bf083681e434b8d7593a08954e918ro7MqS9xFOIaAk7StSGVbajdmn5IDn1upbdHw9OiZbNx5YaeP51obAVmMVcmHuZ4"
  }
};

export const placesWithinExtentMockNoMoreResults = {
  results: [
    {
      place: {
        placeId: "e78051acc722c55ab11ba930d8dd7772",
        location: {
          x: -117.91196600041512,
          y: 33.83153400001845
        },
        categories: [
          {
            categoryId: "13002",
            label: "Bakery"
          },
          {
            categoryId: "13032",
            label: "Cafes, Coffee, and Tea Houses"
          },
          {
            categoryId: "13041",
            label: "Creperie"
          }
        ],
        name: "Le Parfait Paris",
        parentPlaceId: "1f14a89e2d105d492bf4e61008c4fca0"
      }
    }
  ],
  maxResultsExceeded: false,
  pagination: {
    previousUrl:
      "https://places-service.esri.com//rest/v1/world/places/within-extent?xmin=-118.01333400&ymin=33.78193000&xmax=-117.79575300&ymax=33.87333700&categoryIds=13002&f=json&offset=0&pageSize=5&token=AAPK7d4bf083681e434b8d7593a08954e918ro7MqS9xFOIaAk7StSGVbajdmn5IDn1upbdHw9OiZbNx5YaeP51obAVmMVcmHuZ4"
  }
};
