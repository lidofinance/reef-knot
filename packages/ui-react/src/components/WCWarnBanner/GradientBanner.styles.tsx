import styled from '../../utils/styledWrapper';

const MEDIA = {
  WIDTH: {
    EXTRA_LARGE_MAX_WIDTH: 2559,
    CONTENT_MAX_WIDTH: 1360,
    TABLET_MAX_WIDTH: 1199,
    TABLET_MIDDLE_WIDTH: 850,
    MOBILE_MAX_WIDTH: 767,
    MOBILE_MIDDLE_WIDTH: 420,
    MOBILE_SMALL_MAX_WIDTH: 374,
    CONTENT_MIN_WIDTH: 320,
  },
  PADDING: {
    CONTENT_MAX_PADDING: 32,
    CONTENT_MIN_PADDING: 20,
  },
  HEADER: {
    HEADER_HEIGHT: 80,
  },
};

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
  color: #ffffff !important;
  overflow: hidden;
  background: linear-gradient(
    89.98deg,
    #1b4dcb -33.77%,
    #530ec4 27.13%,
    #41aefd 78.79%
  );

  @media (max-width: ${MEDIA.WIDTH.TABLET_MAX_WIDTH}px) {
    padding: 10px 10px 10px 20px;
  }

  @media (max-width: ${MEDIA.WIDTH.MOBILE_MAX_WIDTH}px) {
    padding: 10px 10px 20px 20px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-grow: 1;
  margin-left: 24px;

  @media (max-width: ${MEDIA.WIDTH.TABLET_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0;
  }
`;

export const Title = styled.h2`
  margin-right: 12px;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;

  @media (max-width: ${MEDIA.WIDTH.MOBILE_MAX_WIDTH}px) {
    margin-right: 0;
  }
`;

export const Description = styled.p`
  text-align: center;
  color: ${(p) => p.color};

  position: relative;
  font-size: 12px;
  line-height: 20px;
  margin: 0;
  padding: 0;

  @media (max-width: ${MEDIA.WIDTH.TABLET_MAX_WIDTH}px) {
    font-size: 14px;
    line-height: 24px;
    padding: 0;
    text-align: left;
  }
`;
