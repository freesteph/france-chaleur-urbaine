import { PropsWithChildren } from 'react';
import NextLink from 'next/link';
import { TrackingEvent, trackEvent } from 'src/services/analytics';
import { SpacingProperties, spacingsToClasses } from './helpers/spacings';

const linkVariantToClass = {
  primary: 'fr-btn',
  secondary: 'fr-btn fr-btn--secondary',
  tertiary: 'fr-btn fr-btn--tertiary',
  text: '',
  link: 'fr-link d-inline-block',
} as const;

interface LinkProps extends SpacingProperties {
  href: string;
  event?: string;
  eventKey?: TrackingEvent;
  eventPayload?: string;
  className?: string;
  variant?: keyof typeof linkVariantToClass;
  isExternal?: boolean;
}

/**
 * Renders a DSFR link that uses Next Link.
 * Automatically use a 'a' element when the href contains an anchor to fix scrolling issues.
 * Can track analytics events.
 * Usage:
 *  <Link href="https://url.com" eventKey="Téléchargement|Tracés|carte">Télécharger un tracé</Link>
 */
function Link({
  children,
  href,
  eventKey,
  eventPayload,
  className = '',
  variant = 'text',
  isExternal = false,
  ...props
}: PropsWithChildren<LinkProps>) {
  // when the href contains an anchor, use a classic link which works best with scrolling
  const Tag = href.includes('#') ? 'a' : NextLink;
  return (
    <Tag
      href={href}
      onClick={() => {
        if (eventKey) {
          trackEvent(eventKey, eventPayload?.split(',').map((v) => v.trim()));
        }
      }}
      className={`${className} ${
        linkVariantToClass[variant]
      } ${spacingsToClasses(props)}`}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
export default Link;
