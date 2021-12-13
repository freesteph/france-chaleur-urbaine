import { fetchHttpClient } from '@components/lib';
import '@gouvfr/dsfr/dist/css/dsfr.min.css';
import '@reach/combobox/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import {
  HeatNetworkService,
  ServicesContext,
  SuggestionService,
} from 'src/services';

const imagePreview = `./img/preview/fcu-preview-20211213.min.jpg?date=${Date.now()}`;

const favicons = [
  {
    rel: 'apple-touch-icon',
    href: '/favicons/apple-touch-icon.png',
  },
  { rel: 'icon', href: '/favicons/favicon.svg', type: 'image/svg+xml' },
  {
    rel: 'shortcut icon',
    href: '/favicons/favicon.ico',
    type: 'image/x-icon',
  },
];

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    import('@gouvfr/dsfr/dist/js/dsfr.module.min.js');
  }, []);
  return (
    <>
      <ServicesContext.Provider
        value={{
          suggestionService: new SuggestionService(fetchHttpClient),
          heatNetworkService: new HeatNetworkService(fetchHttpClient),
        }}
      >
        <Head>
          {favicons.map(
            (
              faviconProps: { rel: string; href: string; type?: string },
              i: number
            ) => (
              <link key={i} {...faviconProps} />
            )
          )}
          {/* <!-- HTML Meta Tags --> */}
          <title>
            Facilitez le raccordement à un chauffage économique et écologique
          </title>
          <meta
            name="description"
            content="Un réseau de chaleur est un système de distribution de chaleur produite de façon centralisée qui permet de desservir un grand nombre d’usagers (bâtiments tertiaires publics ou privés, copropriétés, logements sociaux,...). Un des atouts majeurs des réseaux de chaleur est de permettre de mobiliser les énergies renouvelables présentes sur le territoire, difficilement distribuables autrement."
          />

          {/* <!-- Facebook Meta Tags --> */}
          <meta
            property="og:url"
            content="https://france-chaleur-urbaine.beta.gouv.fr/"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Facilitez le raccordement à un chauffage économique et écologique"
          />
          <meta
            property="og:description"
            content="Un réseau de chaleur est un système de distribution de chaleur produite de façon centralisée qui permet de desservir un grand nombre d’usagers (bâtiments tertiaires publics ou privés, copropriétés, logements sociaux,...). Un des atouts majeurs des réseaux de chaleur est de permettre de mobiliser les énergies renouvelables présentes sur le territoire, difficilement distribuables autrement."
          />
          <meta property="og:image" content={imagePreview} />

          {/* <!-- Twitter Meta Tags --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:domain"
            content="france-chaleur-urbaine.beta.gouv.fr"
          />
          <meta
            property="twitter:url"
            content="https://france-chaleur-urbaine.beta.gouv.fr/"
          />
          <meta
            name="twitter:title"
            content="Facilitez le raccordement à un chauffage économique et écologique"
          />
          <meta
            name="twitter:description"
            content="Un réseau de chaleur est un système de distribution de chaleur produite de façon centralisée qui permet de desservir un grand nombre d’usagers (bâtiments tertiaires publics ou privés, copropriétés, logements sociaux,...). Un des atouts majeurs des réseaux de chaleur est de permettre de mobiliser les énergies renouvelables présentes sur le territoire, difficilement distribuables autrement."
          />
          <meta name="twitter:image" content={imagePreview} />

          {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
        </Head>
        <Component {...pageProps} />
      </ServicesContext.Provider>
    </>
  );
}
export default MyApp;
