export type QRTokenPayload = {
  token: string;
  businessId: string;
  shiftId:string;
  timestamp: number;
};

export type QRGenerateResponse = {
  token: string;
};

