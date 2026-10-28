"use client";

import { createContext, useContext } from "react";

export const InvitationContext = createContext<{ opened: boolean }>({ opened: true });

export function useInvitationOpened() {
  return useContext(InvitationContext).opened;
}
