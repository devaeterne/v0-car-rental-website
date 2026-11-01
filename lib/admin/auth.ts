import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/admin/login')
  const { data: admin, error: permissionError } = await supabase.from('admin_users')
    .select('user_id').eq('user_id', user.id).maybeSingle()
  if (permissionError || !admin) redirect('/admin/login?error=access')
  return { supabase, user }
}