import React, { useState } from 'react';
import { guardianApi, Guardian } from '../services/guardian';
import { List, Card, message, Modal, Typography, Tag, Spin, Button, Space } from 'antd';
import { ClockCircleOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

export const GuardianManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { loading: authLoading } = useAuth();
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  const { data: guardians = [], isLoading: guardiansLoading } = useQuery<Guardian[]>(
    'guardians-for',
    guardianApi.getGuardianFor,
    {
      initialData: []
    }
  );

  const acceptMutation = useMutation(guardianApi.acceptInvitation, {
    onSuccess: () => {
      queryClient.invalidateQueries('guardians-for');
      message.success('Invitation accepted successfully');
      setIsAcceptModalVisible(false);
      setSelectedGuardian(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Accept invitation error:', error);
      message.error(error.response?.data?.message || 'Failed to accept invitation');
    },
  });

  const handleAccept = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setIsAcceptModalVisible(true);
  };

  const handleAcceptConfirm = async () => {
    if (!selectedGuardian) return;
    try {
      await acceptMutation.mutateAsync({
        token: selectedGuardian.invitationToken
      });
    } catch {
      // Error is already handled by the mutation
    }
  };

  if (authLoading || guardiansLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Filter guardians to show only pending invitations for the current user
  const pendingGuardians = guardians.filter(g => !g.isAccepted);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="mb-6">
          <Title level={3} className="!mb-0">Guardian Invitations</Title>
          <Text type="secondary">Invitations from users who want you to be their guardian</Text>
        </div>

        <div className="space-y-8">
          {pendingGuardians.length > 0 ? (
            <List
              dataSource={pendingGuardians}
              renderItem={(guardian: Guardian) => (
                <List.Item
                  actions={[
                    <Button
                      key="accept"
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleAccept(guardian)}
                      loading={acceptMutation.isLoading}
                    >
                      Accept
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined className="text-2xl text-orange-500" />}
                    title={
                      <div className="flex items-center gap-2">
                        Guardian Request from {guardian.user?.name}
                        <Tag color="orange">Pending</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div className="text-sm text-gray-500">
                          From: {guardian.user?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Invited on: {new Date(guardian.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires: {new Date(guardian.invitationExpiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-lg">No pending invitations</p>
            </div>
          )}
        </div>
      </Card>

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined className="text-yellow-500" />
            <span>Confirm Guardian Request</span>
          </Space>
        }
        open={isAcceptModalVisible}
        onOk={handleAcceptConfirm}
        onCancel={() => {
          setIsAcceptModalVisible(false);
          setSelectedGuardian(null);
        }}
        confirmLoading={acceptMutation.isLoading}
        okText="Accept Request"
        cancelText="Cancel"
        okButtonProps={{
          danger: false,
          type: 'primary',
        }}
        cancelButtonProps={{
          type: 'default',
        }}
      >
        <div className="space-y-4">
          <Text>
            Are you sure you want to accept this guardian request? This will allow you to:
          </Text>
          <ul className="list-disc pl-6 space-y-2">
            <li>View and manage medications for {selectedGuardian?.user?.name}</li>
            <li>Receive notifications about their medication schedules</li>
            <li>Help ensure proper medication adherence</li>
          </ul>
          {selectedGuardian && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Text strong>Request Details:</Text>
              <div className="mt-2 space-y-1">
                <Text type="secondary">From: {selectedGuardian.user?.name} ({selectedGuardian.user?.email})</Text>
                <Text type="secondary">Sent: {new Date(selectedGuardian.createdAt).toLocaleString()}</Text>
                <Text type="secondary">Expires: {new Date(selectedGuardian.invitationExpiresAt).toLocaleString()}</Text>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}; 