import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const size = Math.min(
        512,
        Math.max(16, parseInt(req.nextUrl.searchParams.get('size') ?? '192'))
    );

    const radius = Math.round(size * 0.2);
    const fontSize = Math.round(size * 0.5);

    return new ImageResponse(
        (
            <div
                style={{
                    width: size,
                    height: size,
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius,
                }}
            >
                {/* Gold accent ring */}
                <div
                    style={{
                        position: 'absolute',
                        width: Math.round(size * 0.7),
                        height: Math.round(size * 0.7),
                        borderRadius: '50%',
                        border: `${Math.max(1, Math.round(size * 0.025))}px solid #d4af6140`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
                <span
                    style={{
                        fontSize,
                        fontWeight: 700,
                        color: '#d4af61',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                    }}
                >
                    C
                </span>
            </div>
        ),
        {
            width: size,
            height: size,
        }
    );
}
