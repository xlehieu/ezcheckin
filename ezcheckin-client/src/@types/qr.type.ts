export type QRGenerate = {
  token: string;
};

export type QRVerifyResponse = {
  valid: boolean;
  message: string;
};