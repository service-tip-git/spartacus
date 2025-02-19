export const PUNCHOUT_SESSION_KEY = 'sid';

export interface PunchoutSession {
  customerId: string;
  cartId: string;
  punchOutLevel: string;
  punchOutOperation: string;
  selectedItem: string;
  token: {
    accessToken: string;
    tokenType: string;
  };
}

export interface PunchoutState {
  session: PunchoutSession;
  sId?: string;
}

export interface PunchoutRequisition {
  browseFormPostUrl: string;
  orderAsCXML: string;
}
