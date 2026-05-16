// app/main/qr/verify/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Result, Spin, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { useApp } from "@/hooks/useApp";
import { useVerifyQRAttendance } from "../../../../features/qr/useVerifyQRAttendance";
import { useLocation } from "@/hooks/useLocation";

const { Title, Text } = Typography;

export default function QRVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify } = useApp();

  const { status, message, verify, reset } = useVerifyQRAttendance();
  const { location,loading:loadingLocation } = useLocation();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      notify.error("Lỗi! Mã QR không hợp lệ");
      return;
    } else if (loadingLocation) {
      return;
    }
    else if (!location){
      notify.error("Lỗi! Không lấy được vị trí");
      return
    }
    verify({
      token,
      location: [location.lng, location.lat],
    });
  }, [token, location,loadingLocation]);

  useEffect(() => {
    if (status === "success") {
      notify.success("Check-in thành công!");
    }
    if (status === "error") {
      notify.error(message);
    }
  }, [status]);

  const handleRetry = async () => {
    if (!token || !location) return;

    reset();
    await verify({
      token,
      location: [location.lng, location.lat],
    });
  };

  const handleBack = () => {
    router.push("/main/qr");
  };

  return (
    <div className="flex items-center justify-center">
      <Card
        className="w-full max-w-md rounded-3xl shadow-2xl"
        styles={{ body: { padding: 32 } }}
      >
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spin size="large" className="mb-4" />

            <Title level={4}>Đang xác thực...</Title>

            <Text type="secondary">Vui lòng chờ</Text>
          </div>
        )}

        {status === "success" && (
          <Result
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            status="success"
            title="Thành công!"
            subTitle={message}
            extra={[
              <Button key="back" type="primary" onClick={handleBack}>
                Quay lại
              </Button>,
            ]}
          />
        )}

        {status === "error" && (
          <Result
            icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            status="error"
            title="Xác thực thất bại"
            subTitle={message}
            extra={[
              <Button key="retry" danger type="primary" onClick={handleRetry}>
                Thử lại
              </Button>,

              <Button key="back" onClick={handleBack}>
                Quay lại
              </Button>,
            ]}
          />
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Title level={4}>Chuẩn bị xác thực...</Title>

            <Text type="secondary">Vui lòng chờ</Text>
          </div>
        )}
      </Card>
    </div>
  );
}
