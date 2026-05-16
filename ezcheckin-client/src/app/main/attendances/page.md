{/* Stats Cards */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={stats.totalEmployees}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Có mặt hôm nay"
                value={stats.presentToday}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vắng mặt"
                value={stats.absentToday}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đi muộn"
                value={stats.lateToday}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Space>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            format="YYYY-MM-DD"
          />
          <Select
            style={{ width: 200 }}
            placeholder="Chọn nhân viên"
            allowClear
            onChange={(value) => setSelectedUserId(value)}
          />
          <Button type="primary" onClick={fetchLogs} loading={loading}>
            Tải lại
          </Button>
        </Space>
      </Card>

      {/* Logs Table */}
      <Card title="Danh sách chấm công">
        <Table
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>