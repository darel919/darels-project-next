import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ message: 'Auth cookie set' }, { status: 200 });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
   try {
    const cookieStore = cookies();
    cookieStore.delete('auth-token');
    return NextResponse.json({ message: 'Auth cookie cleared' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
    return NextResponse.json({ message: 'Internal Server Error during cookie deletion' }, { status: 500 });
  }
}