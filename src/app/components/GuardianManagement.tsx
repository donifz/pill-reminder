import React, { useState } from 'react';
import { guardianApi, Guardian } from '../services/guardian';
import { List, Card, message, Modal, Typography, Tag, Spin, Button, Space, Form, Input, Tabs } from 'antd';
import { ClockCircleOutlined, CheckOutlined, ExclamationCircleOutlined, UserAddOutlined, SendOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const GuardianManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { loading: authLoading } = useAuth();
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [form] = Form.useForm();

  const { data: receivedGuardians = [], isLoading: receivedGuardiansLoading } = useQuery<Guardian[]>(
    'guardians-for',
    guardianApi.getGuardianFor,
    {
      initialData: []
    }
  );

  const { data: sentGuardians = [], isLoading: sentGuardiansLoading } = useQuery<Guardian[]>(
    'guardians',
    guardianApi.getGuardians,
    {
      initialData: [],
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  const inviteMutation = useMutation(guardianApi.inviteGuardian, {
    onSuccess: (data) => {
      console.log('Invitation sent successfully:', data);
      message.success('Invitation sent successfully');
      setIsInviteModalVisible(false);
      form.resetFields();
      // Force refetch both queries
      queryClient.invalidateQueries('guardians');
      queryClient.invalidateQueries('guardians-for');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Invite guardian error:', error);
      message.error(error.response?.data?.message || 'Failed to send invitation');
    },
  });

  const acceptMutation = useMutation(guardianApi.acceptInvitation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['guardians-for', 'guardians']);
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

  const handleInvite = async (values: { email: string }) => {
    try {
      await inviteMutation.mutateAsync(values.email);
    } catch {
      // Error is already handled by the mutation
    }
  };

  if (authLoading || receivedGuardiansLoading || sentGuardiansLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Filter guardians to show only pending invitations
  const pendingReceivedGuardians = receivedGuardians.filter(g => !g.isAccepted);
  const pendingSentGuardians = sentGuardians.filter(g => !g.isAccepted);

  console.log('Pending sent guardians:', pendingSentGuardians);
  console.log('All sent guardians:', sentGuardians);

  const renderGuardianList = (guardians: Guardian[], isReceived: boolean = false) => {
    if (guardians.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-lg">No pending invitations</p>
        </div>
      );
    }

    return (
      <List
        dataSource={guardians}
        renderItem={(guardian: Guardian) => (
          <List.Item
            actions={isReceived ? [
              <Button
                key="accept"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAccept(guardian)}
                loading={acceptMutation.isLoading}
              >
                Accept
              </Button>,
            ] : undefined}
          >
            <List.Item.Meta
              avatar={<ClockCircleOutlined className="text-2xl text-orange-500" />}
              title={
                <div className="flex items-center gap-2">
                  {isReceived ? `Guardian Request from ${guardian.user?.name}` : `Invitation sent to ${guardian.guardian?.email || 'Pending'}`}
                  <Tag color="orange">Pending</Tag>
                </div>
              }
              description={
                <div>
                  <div className="text-sm text-gray-500">
                    {isReceived ? `From: ${guardian.user?.email}` : `To: ${guardian.guardian?.email || 'Pending'}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isReceived ? 'Invited on: ' : 'Sent on: '}{new Date(guardian.createdAt).toLocaleDateString()}
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
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <Title level={3} className="!mb-0">Guardian Management</Title>
              <Text type="secondary">Manage your guardian relationships and invitations</Text>
            </div>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsInviteModalVisible(true)}
            >
              Invite Guardian
            </Button>
          </div>
        </div>

        <Tabs defaultActiveKey="received">
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                Received Invitations
              </span>
            }
            key="received"
          >
            {renderGuardianList(pendingReceivedGuardians, true)}
          </TabPane>
          <TabPane
            tab={
              <span>
                <SendOutlined />
                Sent Invitations
              </span>
            }
            key="sent"
          >
            {renderGuardianList(pendingSentGuardians)}
          </TabPane>
        </Tabs>
      </Card>

      {/* Accept Invitation Modal */}
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

      {/* Invite Guardian Modal */}
      <Modal
        title={
          <Space>
            <UserAddOutlined className="text-blue-500" />
            <span>Invite a Guardian</span>
          </Space>
        }
        open={isInviteModalVisible}
        onCancel={() => {
          setIsInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleInvite}
          layout="vertical"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter the email address of the guardian" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsInviteModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={inviteMutation.isLoading}
            >
              Send Invitation
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}; 