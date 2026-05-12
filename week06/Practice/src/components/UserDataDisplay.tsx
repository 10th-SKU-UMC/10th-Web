import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

export const App = () => {
  return (
    <div>
      <WelcomeData />
    </div>
  );
}

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

const btnBase: React.CSSProperties = {
  padding: '16px 28px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 500,
  background: '#1e1e1e',
  color: '#ffffff',
};

export const WelcomeData = () => {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = () => {
    let randomId: number;
    do {
      randomId = Math.floor(Math.random() * 10) + 1;
    } while (randomId === userId);
    setUserId(randomId);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        padding: '40px',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="glow-btn" style={btnBase} onClick={handleChangeUser}>
          다른 사용자 불러오기
        </button>
        <button className="glow-btn" style={btnBase} onClick={() => setIsVisible(!isVisible)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button
          className="glow-btn"
          style={{ ...btnBase, background: '#f59e0b' }}
          onClick={handleTestRetry}
        >
          재시도 테스트 (404 에러)
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, error } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return <div style={{ color: '#ffffff', fontSize: '18px' }}>Loading... (User ID: {userId})</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', fontSize: '18px' }}>Error Occurred</div>;
  }

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h1 style={{ fontSize: '64px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
        {data?.name}
      </h1>
      <p style={{ fontSize: '20px', color: '#d1d5db', margin: 0 }}>{data?.email}</p>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>User ID: {data?.id}</p>
    </div>
  );
};
