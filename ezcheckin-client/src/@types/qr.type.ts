export type QRGenerate = {
  token: string;
};
export type StatusCheckin ="LATE"|"ON_TIME"
export type StatusCheckout ="EARLY"|"ON_TIME"
export type QRVerifyResponse = {
  data: {
    checkinLocation: {
      type: "Point";
      coordinates: number[];
    };
    checkoutLocation: {
      type: "Point";
      coordinates: number[];
    };
    _id: string;
    user: string;
    business:string;
    shift: string;
    workDate: string;
    checkinTime: string;
    checkoutTime: string;
    statusCheckin: StatusCheckin;
    statusCheckout: StatusCheckout;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
  type: "CHECKIN" | "CHECKOUT";
};

export type QRVerifyAttendancePayload = {
  token: string;
  location: number[];
};
