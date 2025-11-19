import { NextResponse } from 'next/server';
import { getSupabaseServer, getAuthUserId } from '@/src/utils/supabaseServer';

export async function GET(req) {
  const supabase = getSupabaseServer();
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  const projectId = searchParams.get('projectId');

  let query = supabase.from('tasks').select('*');
  if (organizationId) query = query.eq('organizationId', organizationId);
  if (projectId) query = query.eq('projectId', projectId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ tasks: data || [] });
}

export async function POST(req) {
  const supabase = getSupabaseServer();
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const name = (body?.name || '').toString().slice(0, 255);
    const description = body?.description ? body.description.toString().slice(0, 600) : null;
    const projectId = body?.projectId;
    if (!name || !projectId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Get project to derive organizationId server-side
    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('id, organizationId')
      .eq('id', projectId)
      .maybeSingle();
    if (projErr) throw projErr;
    if (!proj) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const { data: task, error: insErr } = await supabase
      .from('tasks')
      .insert({ name, description, projectId: proj.id, organizationId: proj.organizationId })
      .select('*')
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Failed to create task' }, { status: 400 });
  }
}
