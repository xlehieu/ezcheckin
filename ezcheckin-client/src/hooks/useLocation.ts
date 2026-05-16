"use client";

import { useEffect, useState } from "react";

type Location = {
  lat: number;
  lng: number;
};

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ geolocation");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLoading(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Người dùng từ chối cấp quyền vị trí");
            break;

          case error.POSITION_UNAVAILABLE:
            setError("Không thể lấy vị trí");
            break;

          case error.TIMEOUT:
            setError("Lấy vị trí bị timeout");
            break;

          default:
            setError("Đã xảy ra lỗi");
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
  };
}