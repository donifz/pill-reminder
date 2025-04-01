import React, { useState, useEffect } from 'react';
import { guardianService, Guardian, GuardianFor } from '@/services/guardian.service';
import { Button, Input, List, Card, Typography, message } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const GuardianManagement: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [guardianFor, setGuardianFor] = useState<GuardianFor[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGuardians();
  }, []);

  const loadGuardians = async () => {
    try {
      const response = await guardianService.getGuardians();
      setGuardians(response.guardians);
      setGuardianFor(response.guardianFor);
    } catch (error) {
      message.error('Failed to load guardians');
    }
  };

  const handleInviteGuardian = async () => {
    if (!inviteEmail) {
      message.warning('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await guardianService.inviteGuardian(inviteEmail);
      message.success('Guardian invitation sent successfully');
      setInviteEmail('');
      loadGuardians();
    } catch (error) {
      message.error('Failed to send guardian invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGuardian = async (guardianId: string) => {
    try {
      await guardianService.removeGuardian(guardianId);
      message.success('Guardian removed successfully');
      loadGuardians();
    } catch (error) {
      message.error('Failed to remove guardian');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title level={4}>Invite Guardian</Title>
        <div className="flex gap-2">
          <Input
            placeholder="Enter guardian's email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleInviteGuardian}
            loading={loading}
          >
            Invite
          </Button>
        </div>
      </Card>

      <Card>
        <Title level={4}>Your Guardians</Title>
        <List
          dataSource={guardians}
          renderItem={(guardian) => (
            <List.Item
              actions={[
                <Button
                  key="remove"
                  type="text"
                  danger
                  icon={<UserDeleteOutlined />}
                  onClick={() => handleRemoveGuardian(guardian.id)}
                >
                  Remove
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={guardian.name}
                description={
                  <div>
                    <Text>{guardian.email}</Text>
                    {!guardian.isAccepted && (
                      <Text type="warning" className="ml-2">
                        (Pending)
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card>
        <Title level={4}>Users You Are Guardian For</Title>
        <List
          dataSource={guardianFor}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                title={user.name}
                description={
                  <div>
                    <Text>{user.email}</Text>
                    {!user.isAccepted && (
                      <Text type="warning" className="ml-2">
                        (Pending)
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}; 