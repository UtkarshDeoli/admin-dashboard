import { NextRequest, NextResponse } from 'next/server';

interface NotificationRequest {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

// Initialize Firebase Admin at module level
let admin: any;
let messaging: any;

async function getFirebaseAdmin() {
  if (!admin) {
    admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    messaging = admin.messaging();
  }
  return { admin, messaging };
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json();
    const { tokens, title, body: messageBody, data } = body;

    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { error: 'No FCM tokens provided' },
        { status: 400 }
      );
    }

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Check if Firebase credentials are configured
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.log('Firebase not configured - mock notification:', { tokens, title, messageBody, data });
      return NextResponse.json({
        success: true,
        message: 'Notifications queued (Firebase not configured)',
        sent: tokens.length,
        failed: 0
      });
    }

    const { messaging: firebaseMessaging } = await getFirebaseAdmin();

    let sent = 0;
    let failed = 0;

    // Send notification to each token
    for (const token of tokens) {
      try {
        const message: any = {
          notification: {
            title,
            body: messageBody,
          },
          token,
        };

        if (data) {
          message.data = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
          );
        }

        await firebaseMessaging.send(message);
        sent++;
        console.log('FCM send success to token:', token.substring(0, 20) + '...');
      } catch (error: any) {
        failed++;
        console.error('FCM send error:', error.message || error);
      }
    }

    return NextResponse.json({
      success: sent > 0,
      sent,
      failed,
    });
  } catch (error: any) {
    console.error('Notification error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to send notifications: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
