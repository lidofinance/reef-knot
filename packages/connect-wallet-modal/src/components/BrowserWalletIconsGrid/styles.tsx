import styled from '@reef-knot/ui-react/styled-wrapper';

export const ICON_SIZE = 20;
export const CONTAINER_SIZE = 44;
export const GAP = 4;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: ${GAP}px;
  width: ${CONTAINER_SIZE}px;
  height: ${CONTAINER_SIZE}px;
`;

export const IconImg = styled.img`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: 50%;
  display: block;
`;

export const DefaultSvgIcon = styled.svg`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: 50%;
  display: block;
`;
