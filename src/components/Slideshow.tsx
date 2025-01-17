import React, { useState } from 'react';
import { Icon } from '@dataesr/react-dsfr';
import Box from './ui/Box';

export interface SlideshowProps {
  images: string[];
}

/**
 * Displays basic slideshow of images.
 */
const Slideshow = ({ images }: SlideshowProps) => {
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);

  return (
    <Box display="flex" flexDirection="column">
      <img
        src={images[visibleSlideIndex]}
        alt=""
        className="fr-responsive-img"
        loading="lazy"
        style={{
          maxHeight: '350px',
          objectFit: 'contain',
        }}
      />

      <nav
        role="navigation"
        className="fr-pagination fr-mt-1w"
        aria-label="Pagination"
      >
        <ul className="fr-pagination__list">
          <li>
            <a
              className="fr-pagination__link"
              role="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setVisibleSlideIndex(
                  (visibleSlideIndex - 1 + images.length) % images.length
                );
              }}
            >
              <Icon name="ri-arrow-left-s-line" />
              Précédent
            </a>
          </li>
          <li className="fr-col" aria-hidden />
          <li>
            <a
              className="fr-pagination__link"
              role="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setVisibleSlideIndex((visibleSlideIndex + 1) % images.length);
              }}
            >
              Suivant
              <Icon name="ri-arrow-right-s-line" />
            </a>
          </li>
        </ul>
      </nav>
    </Box>
  );
};

export default Slideshow;
