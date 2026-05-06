import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Fitosys - Business OS for Fitness Coaches';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#E8001D',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 20,
              fontFamily: 'sans-serif',
            }}
          >
            Manage 40 clients with the<br/>effort of 15.
          </div>
          <div
            style={{
              fontSize: 40,
              color: '#A0A0A0',
              fontFamily: 'sans-serif',
              fontWeight: 600,
            }}
          >
            Fitosys: Business OS for Fitness Coaches
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
