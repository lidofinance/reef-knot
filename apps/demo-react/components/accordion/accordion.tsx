import { useState, FC, PropsWithChildren } from 'react';
import { ButtonIcon } from '@lidofinance/lido-ui';

import { ArrowBottomStyle, ContentStyle } from './accordion-style';

type AccordionProps = {
  title: string | JSX.Element;
};

export const Accordion: FC<PropsWithChildren<AccordionProps>> = (props) => {
  const [open, setOpen] = useState(false);
  const { title, children } = props;

  return (
    <div>
      <ButtonIcon
        icon={<ArrowBottomStyle $open={open} />}
        onClick={() => setOpen(!open)}
        size="xxs"
        variant="ghost"
      >
        {title}
      </ButtonIcon>
      <ContentStyle $open={open}>{children}</ContentStyle>
    </div>
  );
};
