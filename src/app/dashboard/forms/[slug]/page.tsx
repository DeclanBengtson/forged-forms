import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FormDetailClient from './form-detail-client'

interface FormDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function FormDetailPage({ params }: FormDetailPageProps) {
  const supabase = await createClient()
  const { slug } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <FormDetailClient slug={slug} user={user} />
} 