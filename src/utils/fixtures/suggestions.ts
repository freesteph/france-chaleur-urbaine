import { SuggestionResponse } from 'src/types/Suggestions';

export const someSuggestions = (): SuggestionResponse => ({
  type: 'FeatureCollection',
  version: 'draft',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [2.304422, 48.843246],
      },
      properties: {
        label: '90 Rue Lecourbe 75015 Paris',
        score: 0.8956363636363637,
        housenumber: '90',
        id: '75115_5456_00090',
        name: '90 Rue Lecourbe',
        postcode: '75015',
        citycode: '75115',
        x: 648950.42,
        y: 6860580.25,
        city: 'Paris',
        district: 'Paris 15e Arrondissement',
        context: '75, Paris, Île-de-France',
        type: 'housenumber',
        importance: 0.852,
        street: 'Rue Lecourbe',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-0.561772, 44.822527],
      },
      properties: {
        label: '90 Rue Pelleport 33800 Bordeaux',
        score: 0.8953345454545455,
        housenumber: '90',
        id: '33063_7105_00090',
        name: '90 Rue Pelleport',
        postcode: '33800',
        citycode: '33063',
        x: 418540.93,
        y: 6420056.43,
        city: 'Bordeaux',
        context: '33, Gironde, Nouvelle-Aquitaine',
        type: 'housenumber',
        importance: 0.84868,
        street: 'Rue Pelleport',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-0.563405, 44.824886],
      },
      properties: {
        label: '90 Rue Malbec 33800 Bordeaux',
        score: 0.8947645454545454,
        housenumber: '90',
        id: '33063_5860_00090',
        name: '90 Rue Malbec',
        postcode: '33800',
        citycode: '33063',
        x: 418423.79,
        y: 6420324,
        city: 'Bordeaux',
        context: '33, Gironde, Nouvelle-Aquitaine',
        type: 'housenumber',
        importance: 0.84241,
        street: 'Rue Malbec',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1.460365, 43.579427],
      },
      properties: {
        label: '90 Rue Bonnat 31400 Toulouse',
        score: 0.8947318181818181,
        housenumber: '90',
        id: '31555_1244_00090',
        name: '90 Rue Bonnat',
        postcode: '31400',
        citycode: '31555',
        x: 575608.33,
        y: 6276809.06,
        city: 'Toulouse',
        context: '31, Haute-Garonne, Occitanie',
        type: 'housenumber',
        importance: 0.84205,
        street: 'Rue Bonnat',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-0.58595, 44.846254],
      },
      properties: {
        label: '90 Rue Turenne 33000 Bordeaux',
        score: 0.89446,
        housenumber: '90',
        id: '33063_9115_00090',
        name: '90 Rue Turenne',
        postcode: '33000',
        citycode: '33063',
        x: 416751.28,
        y: 6422775.56,
        city: 'Bordeaux',
        context: '33, Gironde, Nouvelle-Aquitaine',
        type: 'housenumber',
        importance: 0.83906,
        street: 'Rue Turenne',
      },
    },
  ],
  attribution: 'BAN',
  licence: 'ETALAB-2.0',
  query: '90 rue',
  filters: {
    type: 'housenumber',
  },
  limit: 5,
});
