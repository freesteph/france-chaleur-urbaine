import WrappedText from '@components/WrappedText';
import Link from 'next/link';
import { growths } from './config';
import { Questions } from './Growth.styles';
import { Block, BlockTitle } from './Issues.styles';

const Growth = () => {
  return (
    <WrappedText title="Une filière en pleine croissance">
      <Questions>
        {Object.entries(growths).map(([key, growth]) => (
          <Block key={key}>
            <BlockTitle>{growth.title}</BlockTitle>
            {growth.description}
            <br />
            <Link href={`/ressources/${key}`}>Lire l'article</Link>
          </Block>
        ))}
      </Questions>
    </WrappedText>
  );
};

export default Growth;