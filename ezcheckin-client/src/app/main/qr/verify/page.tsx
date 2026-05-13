"use client";

import { verifyQR } from "@/features/qr/qr.action";
import { useApp } from "@/hooks/useApp";
import { Button, Card, Result, Spin, Typography, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type VerifyStatus = "loading" | "success" | "error" | "idle";

export default function QRVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify } = useApp();

  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setStatus("error");
      setMessage("Mã QR không hợp lệ");
      return;
    }

    setToken(tokenParam);
    handleVerify(tokenParam);
  }, []);

  const handleVerify = async (qrToken: string) => {
    try {
      setStatus("loading");
      const response = await verifyQR(qrToken);

      if (response.valid) {
        setStatus("success");
        setMessage(response.message || "Check-in thành công!");
        notify.success("Check-in thành công!");
      } else {
        setStatus("error");
        setMessage(response.message || "Mã QR không hợp lệ");
        notify.error(response.message || "Mã QR không hợp lệ");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Lỗi khi xác thực mã QR");
      notify.error("Lỗi khi xác thực mã QR");
      console.error("Error verifying QR:", error);
    }
  };

  const handleRetry = () => {
    if (token) {
      setStatus("idle");
      setMessage("");
      handleVerify(token);
    }
  };

  const handleBack = () => {
    router.push("/main/qr");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
          <div className="flex flex-col items-center">
            <div className="text-6xl text-green-500 mb-4">
              <CheckCircleOutlined />
            </div>
            <Title level={3} style={{ color: "#52c41a", marginBottom: 8 }}>
              Thành công!
            </Title>
            <Text className="text-center mb-6 text-gray-600">
              {message}
            </Text>
            <Text type="secondary" className="text-center text-sm mb-8">
              Bạn đã check-in thành công cho ca làm việc
            </Text>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleBack}
              className="mb-2"
            >
              Quay lại
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="text-6xl text-red-500 mb-4">
              <CloseCircleOutlined />
            </div>
            <Title level={3} style={{ color: "#ff4d4f", marginBottom: 8 }}>
              Xác thực thất bại
            </Title>
            <Text className="text-center mb-6 text-gray-600">
              {message}
            </Text>
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                danger
                size="large"
                block
                onClick={handleRetry}
              >
                Thử lại
              </Button>
              <Button size="large" block onClick={handleBack}>
                Quay lại
              </Button>
            </Space>
          </div>
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
