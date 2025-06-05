import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's forms count
    const { count: formsCount, error: formsError } = await supabase
      .from('forms')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (formsError) {
      throw new Error(`Failed to count forms: ${formsError.message}`);
    }

    // Get all user's form IDs
    const { data: userForms, error: userFormsError } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', user.id);

    if (userFormsError) {
      throw new Error(`Failed to get user forms: ${userFormsError.message}`);
    }

    const formIds = userForms?.map(f => f.id) || [];

    let monthlySubmissions = 0;
    let submissionsThisWeek = 0;
    let totalSubmissions = 0;

    if (formIds.length > 0) {
      // Calculate date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)

      // Get monthly submissions count
      const { count: monthlyCount, error: monthlyError } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('form_id', formIds)
        .gte('submitted_at', startOfMonth.toISOString());

      if (monthlyError) {
        throw new Error(`Failed to count monthly submissions: ${monthlyError.message}`);
      }

      // Get weekly submissions count
      const { count: weeklyCount, error: weeklyError } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('form_id', formIds)
        .gte('submitted_at', startOfWeek.toISOString());

      if (weeklyError) {
        throw new Error(`Failed to count weekly submissions: ${weeklyError.message}`);
      }

      // Get total submissions count
      const { count: totalCount, error: totalError } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('form_id', formIds);

      if (totalError) {
        throw new Error(`Failed to count total submissions: ${totalError.message}`);
      }

      monthlySubmissions = monthlyCount || 0;
      submissionsThisWeek = weeklyCount || 0;
      totalSubmissions = totalCount || 0;
    }

    // Get submission trend for the last 7 days
    const trendData = [];
    if (formIds.length > 0) {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const { count, error } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .in('form_id', formIds)
          .gte('submitted_at', startOfDay.toISOString())
          .lt('submitted_at', endOfDay.toISOString());

        if (!error) {
          trendData.push({
            date: startOfDay.toISOString().split('T')[0],
            count: count || 0
          });
        }
      }
    }

    return NextResponse.json({
      usage: {
        formsCount: formsCount || 0,
        monthlySubmissions,
        submissionsThisWeek,
        totalSubmissions,
        submissionTrend: trendData
      }
    });

  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 