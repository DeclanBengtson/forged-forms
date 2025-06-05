import { createClient } from '@/lib/supabase/server'
import { UserProfile, UserProfileInsert, UserProfileUpdate, SubscriptionLimits } from '@/lib/types/database'

// Get user profile by user ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found, create one
      return await createUserProfile({ user_id: userId })
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }

  return data
}

// Create user profile
export async function createUserProfile(profile: UserProfileInsert): Promise<UserProfile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  return data
}

// Update user profile
export async function updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`)
  }

  return data
}

// Get subscription limits based on user's subscription status
export function getSubscriptionLimits(subscriptionStatus: 'free' | 'starter' | 'pro' | 'enterprise'): SubscriptionLimits {
  switch (subscriptionStatus) {
    case 'free':
      return {
        maxForms: 3,
        maxSubmissionsPerMonth: 250,
        maxSubmissionsPerForm: 50,
        emailNotifications: true,
        customDomains: false,
        apiAccess: false,
        exportData: false,
        priority_support: false
      }
    case 'starter':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: 2000,
        maxSubmissionsPerForm: 500,
        emailNotifications: true,
        customDomains: false,
        apiAccess: false,
        exportData: true,
        priority_support: false
      }
    case 'pro':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: 10000,
        maxSubmissionsPerForm: 2000,
        emailNotifications: true,
        customDomains: true,
        apiAccess: true,
        exportData: true,
        priority_support: true
      }
    case 'enterprise':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: -1, // Unlimited
        maxSubmissionsPerForm: -1, // Unlimited
        emailNotifications: true,
        customDomains: true,
        apiAccess: true,
        exportData: true,
        priority_support: true
      }
    default:
      return getSubscriptionLimits('free')
  }
}

// Check if user can create more forms
export async function canUserCreateForm(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
  const profile = await getUserProfile(userId)
  if (!profile) {
    return { canCreate: false, reason: 'User profile not found' }
  }

  const limits = getSubscriptionLimits(profile.subscription_status)
  
  if (limits.maxForms === -1) {
    return { canCreate: true }
  }

  // Count user's current forms
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to count user forms: ${error.message}`)
  }

  const currentFormCount = count || 0
  
  if (currentFormCount >= limits.maxForms) {
    return { 
      canCreate: false, 
      reason: `You've reached the maximum number of forms (${limits.maxForms}) for your ${profile.subscription_status} plan.` 
    }
  }

  return { canCreate: true }
}

// Check if user can receive more submissions this month
export async function canUserReceiveSubmission(userId: string, formId: string): Promise<{ canReceive: boolean; reason?: string }> {
  const profile = await getUserProfile(userId)
  if (!profile) {
    return { canReceive: false, reason: 'User profile not found' }
  }

  const limits = getSubscriptionLimits(profile.subscription_status)
  
  if (limits.maxSubmissionsPerMonth === -1 && limits.maxSubmissionsPerForm === -1) {
    return { canReceive: true }
  }

  const supabase = await createClient()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Check monthly limit (Issue #6 Fix: Check across all user forms)
  if (limits.maxSubmissionsPerMonth !== -1) {
    // Get all user's forms first
    const { data: userForms, error: formsError } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', userId)

    if (formsError) {
      throw new Error(`Failed to get user forms: ${formsError.message}`)
    }

    const formIds = userForms?.map(f => f.id) || []
    
    if (formIds.length > 0) {
      const { count: monthlyCount, error: monthlyError } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('form_id', formIds)
        .gte('submitted_at', startOfMonth.toISOString())

      if (monthlyError) {
        throw new Error(`Failed to count monthly submissions: ${monthlyError.message}`)
      }

      if ((monthlyCount || 0) >= limits.maxSubmissionsPerMonth) {
        return { 
          canReceive: false, 
          reason: `Monthly submission limit (${limits.maxSubmissionsPerMonth}) reached for your ${profile.subscription_status} plan.` 
        }
      }
    }
  }

  // Check per-form limit
  if (limits.maxSubmissionsPerForm !== -1) {
    const { count: formCount, error: formError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId)

    if (formError) {
      throw new Error(`Failed to count form submissions: ${formError.message}`)
    }

    if ((formCount || 0) >= limits.maxSubmissionsPerForm) {
      return { 
        canReceive: false, 
        reason: `Form submission limit (${limits.maxSubmissionsPerForm}) reached for your ${profile.subscription_status} plan.` 
      }
    }
  }

  return { canReceive: true }
}

// Update subscription status (for Stripe webhook integration)
export async function updateUserSubscription(
  userId: string, 
  subscriptionData: {
    subscription_status: 'free' | 'starter' | 'pro' | 'enterprise'
    subscription_id?: string | null
    customer_id?: string | null
    current_period_start?: string | null
    current_period_end?: string | null
    cancel_at_period_end?: boolean
    trial_end?: string | null
  }
): Promise<UserProfile> {
  return await updateUserProfile(userId, subscriptionData)
} 