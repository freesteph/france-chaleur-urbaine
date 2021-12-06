import styled, { css } from 'styled-components';

export const SliceSection = styled.section<{ theme?: string }>`
  ${({ theme }) => {
    switch (theme) {
      case 'color': {
        return css`
          background-color: #4550e5;
          color: #fff;
        `;
      }
      case 'grey': {
        return css`
          background-color: #f9f8f6;
        `;
      }
    }
  }}
`;

export type SliceContainerWrapperType = {
  bg?: string;
  bgPos?: string;
  bgSize?: string;
  bgWidth?: number;
  bgColor?: string;
  bleedColors?: [string, string];
};

const linearGradientToLeft = css<SliceContainerWrapperType>`
  ${({ bleedColors, bgWidth = 0 }) =>
    bleedColors?.[0]
      ? `
  linear-gradient(
    to left,
    transparent calc(50% + ${bgWidth / 2}px - 80px),
    ${bleedColors[0]} calc(50% + ${bgWidth / 2}px)
  ),`
      : ''}
`;
const linearGradientToRight = css<SliceContainerWrapperType>`
  ${({ bleedColors, bgWidth = 0 }) =>
    bleedColors?.[1]
      ? `
  linear-gradient(
    to right,
    transparent calc(50% + ${bgWidth / 2}px - 80px),
    ${bleedColors[1]} calc(50% + ${bgWidth / 2}px)
  ),`
      : ''}
`;
const bgUrl = css<SliceContainerWrapperType>`
  ${({ bg }) => (bg ? `url(${bg})` : '')}
`;

export const SliceContainerWrapper = styled.div<SliceContainerWrapperType>`
  max-width: 100%;

  ${({ bg, bleedColors }) =>
    bg || bleedColors
      ? css`
          background-image: ${linearGradientToLeft} ${linearGradientToRight}
            ${bgUrl};
        `
      : ''};
  ${({ bgColor }) =>
    bgColor
      ? css`
          background-color: ${bgColor};
        `
      : ''};
  background-repeat: no-repeat;
  background-size: ${({ bgSize }) => bgSize || 'auto'};
  background-position: ${({ bgPos }) => bgPos || 'center'};
  ${({ bgWidth = 0 }) =>
    bgWidth &&
    css`
      background-size: ${'cover'};
      background-position: left center;
      @media (min-width: ${bgWidth}px) {
        background-size: contain;
        background-position: center;
      }
    `}
`;

export const SliceContainer = styled.div`
  max-width: 78rem;

  .slice-header {
    text-align: center;
    padding: 1.5rem 0 2rem;

    h2 {
      color: #000074;
      margin-bottom: 0;

      + h2 {
        margin-bottom: 1rem;
      }
    }
    em {
      font-style: normal;
      color: #4550e5;
    }
  }
`;