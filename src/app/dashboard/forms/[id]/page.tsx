import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FormDetailClient from './form-detail-client'

interface FormDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function FormDetailPage({ params }: FormDetailPageProps) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <FormDetailClient id={id} user={user} />
} 