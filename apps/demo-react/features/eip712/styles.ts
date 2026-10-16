import styled from 'styled-components';

export const Card = styled.section`
  width: 100%;
  min-width: 0;
  margin-top: 24px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;

  h2 {
    margin: 0;
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: -0.3px;
  }

  p {
    margin: 6px 0 0;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Muted = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;

export const Connection = styled.div`
  margin: 20px 0;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;

  strong {
    font-weight: 600;
  }

  code {
    font-size: 13px;
  }
`;

export const Message = styled.div`
  padding-left: 14px;
  margin: 20px 0;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

export const Eyebrow = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Details = styled.details`
  margin-top: 16px;

  summary {
    width: fit-content;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
  }

  summary:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &[open] > summary {
    margin-bottom: 12px;
  }
`;

export const Code = styled.pre`
  margin: 12px 0;
  padding: 14px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 320px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
`;

export const Result = styled.div<{
  $tone: 'success' | 'error' | 'neutral';
}>`
  margin-top: 20px;
  padding: 16px;
  border: 1px solid
    ${({ theme, $tone }) =>
      $tone === 'neutral' ? theme.colors.border : theme.colors[$tone]};
  border-radius: 12px;

  strong {
    display: block;
    font-size: 15px;
  }
`;

export const EnvironmentFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0;

  label {
    display: grid;
    gap: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  input {
    width: 100%;
    min-width: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: 10px 12px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    font: inherit;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
