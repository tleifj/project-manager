import { NextResponse } from 'next/server';
import { getSupabaseServer, getAuthUserId } from '@/utils/supabaseServer';

export async function GET(req) {
  const supabase = getSupabaseServer();
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  const workspaceId = searchParams.get('workspaceId');

  let query = supabase.from('projects').select('*');
  if (organizationId) query = query.eq('organizationId', organizationId);
  if (workspaceId) query = query.eq('workspaceId', workspaceId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ projects: data || [] });
}

export async function POST(req) {
  const supabase = getSupabaseServer();
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const name = (body?.name || '').toString().slice(0, 255);
    const description = body?.description ? body.description.toString().slice(0, 600) : null;
    const workspaceId = body?.workspaceId;
    if (!name || !workspaceId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Fetch workspace to derive organizationId server-side
    const { data: ws, error: wsErr } = await supabase
      .from('workspaces')
      .select('id, organizationId')
      .eq('id', workspaceId)
      .maybeSingle();
    if (wsErr) throw wsErr;
    if (!ws) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const { data: proj, error: insErr } = await supabase
      .from('projects')
      .insert({ name, description, workspaceId: ws.id, organizationId: ws.organizationId })
      .select('*')
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ project: proj }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Failed to create project' }, { status: 400 });
  }
}
