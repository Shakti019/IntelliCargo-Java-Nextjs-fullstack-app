import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { verifyJwt, getJwtFromHeader } from '@/lib/auth';

export async function POST(req: Request) {
  // 1. Validate JWT
  const token = getJwtFromHeader(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const user = await verifyJwt(token);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  try {
    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Perform Operation (Example: Create an Activity Log)
    // In a real scenario, this might be creating a Notification or Chat message
    const body = await req.json();
    
    const newLog = await ActivityLog.create({
      userId: user.sub, // 'sub' is typically the email/username from the JWT
      action: 'TEST_CONNECTION',
      entityType: 'SYSTEM',
      entityId: 'test-id',
      details: {
        message: 'Verifying MongoDB connection from Next.js API',
        payload: body
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Connected to MongoDB and validated JWT',
      data: newLog 
    });

  } catch (error: any) {
    console.error('Database Error:', error);
    
    // Check if error is due to MongoDB connection string special characters
    if (error.name === 'MongoParseError') {
       return NextResponse.json({ 
         error: 'MongoDB Connection String Error', 
         details: 'Ensure special characters in password (like #, ?, @) are URL encoded.',
         raw: error.message 
       }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error', details: error.message, stack: error.stack }, { status: 500 });
  }
}
