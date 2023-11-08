import MainContainer from '@components/shared/layout';
import Statistics from '@components/Statistics/StatisticsV1';
import Head from 'next/head';

function Statistiques() {
  return (
    <>
      <Head>
        <title>Statistiques - France Chaleur Urbaine</title>
      </Head>
      <MainContainer currentMenu="/stats">
        <Statistics />
      </MainContainer>
    </>
  );
}

export default Statistiques;
