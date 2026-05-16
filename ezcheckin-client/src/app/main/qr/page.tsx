"use client";
import { OptionsFetch } from "@/@types/common";
import { generateQR } from "@/features/qr/qr.action";
import { useShifts } from "@/features/shifts/useShift";
import { useApp } from "@/hooks/useApp";
import { Button, Card, Divider, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const { Title, Text } = Typography;

export default function QRCheckinPage() {
  const [token, setToken] = useState<string | null>(null);
  const [shiftId, setShiftId] = useState<string | null>(null);
  const { data: shiftList } = useShifts();
  const qrValue = token
    ? `${process.env.NEXT_PUBLIC_APP_URL}/main/qr/verify?token=${token}`
    : null;
  const { notify } = useApp();
  const getToken = async (options?: OptionsFetch) => {
    try {
      if (shiftId) {
        const token = await generateQR(shiftId, options);
        setToken(token);
      }
    } catch (error) {
      notify.error("Lỗi khi tải danh sách ca làm việc");
    } finally {
    }
  };

  useEffect(() => {
    getToken();
  }, [shiftId]);
  return (
    <div className="flex items-center justify-center">
      <Card
        className="w-full max-w-md rounded-3xl shadow-xl"
        styles={{ body: { padding: 24 } }}
      >
        {qrValue && (
          <>
            <div className="text-center mb-6">
              <Title level={3} style={{ marginBottom: 8 }}>
                QR Check-in
              </Title>

              <Text type="secondary">Quét mã QR để thực hiện check-in</Text>
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <QRCode value={qrValue} size={260} />
              </div>
            </div>
          </>
        )}

        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Text strong>Chọn ca làm việc</Text>

            <Select
              className="w-full mt-2"
              size="large"
              placeholder="-- Chọn ca --"
              options={shiftList.map((shift) => ({
                value: shift._id,
                label: (
                  <p>
                    {shift.shiftName} ({shift.startTime} - {shift.endTime})
                  </p>
                ),
              }))}
              onChange={(value) => {
                setShiftId(value);
              }}
            />
          </div>

          <Button type="primary" size="large" block>
            Tạo mã QR mới
          </Button>
        </Space>

        <Divider />

        <div className="text-center">
          <Text type="secondary">Mã QR sẽ hết hạn sau 15 phút</Text>
        </div>
      </Card>
    </div>
  );
}
