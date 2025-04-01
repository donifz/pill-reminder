'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { guardianApi } from '../../services/guardian';
import { Card, Result, Button, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function AcceptInvitation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid invitation link');
      return;
    }

    const acceptInvitation = async () => {
      try {
        await guardianApi.acceptInvitation(token);
        setStatus('success');
        // Redirect to guardians page after 3 seconds
        setTimeout(() => {
          router.push('/guardians');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to accept invitation. The link may have expired.');
      }
    };

    acceptInvitation();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Accepting invitation...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <Result
            status="error"
            icon={<CloseCircleOutlined />}
            title="Failed to Accept Invitation"
            subTitle={errorMessage}
            extra={[
              <Button type="primary" key="home" onClick={() => router.push('/')}>
                Go to Home
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <Result
          status="success"
          icon={<CheckCircleOutlined />}
          title="Invitation Accepted!"
          subTitle="You will be redirected to the guardians page shortly."
          extra={[
            <Button type="primary" key="guardians" onClick={() => router.push('/guardians')}>
              Go to Guardians
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
} 