import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user is a super-admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminUser?.role !== 'super-admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users using service role
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const [adminUsers, authUsers] = await Promise.all([
      supabase.from('admin_users').select('*').order('created_at', { ascending: false }),
      adminClient.auth.admin.listUsers()
    ]);

    return NextResponse.json({
      adminUsers: adminUsers.data,
      authUsers: authUsers.data.users
    });
  } catch (error) {
    console.error('Error in users route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 