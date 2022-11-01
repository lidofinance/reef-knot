import { ReactChild, ReactFragment, ReactPortal } from "react";

export type ReactProps = { children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }
