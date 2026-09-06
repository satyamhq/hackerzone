export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "recruiter" | "campus_admin" | "admin";
export type ProfileVisibility = "public" | "anonymous";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          phone: string | null;
          location: string | null;
          visibility: ProfileVisibility;
          gpa_visible: boolean;
          gpa: number | null;
          graduation_year: number | null;
          degree: string | null;
          major: string | null;
          resume_url: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          visibility?: ProfileVisibility;
          gpa_visible?: boolean;
          gpa?: number | null;
          graduation_year?: number | null;
          degree?: string | null;
          major?: string | null;
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          visibility?: ProfileVisibility;
          gpa_visible?: boolean;
          gpa?: number | null;
          graduation_year?: number | null;
          degree?: string | null;
          major?: string | null;
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          verified_score: number;
          badge_tier: string;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          verified_score?: number;
          badge_tier?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          verified_score?: number;
          badge_tier?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          skill_id: string;
          title: string;
          slug: string;
          description: string;
          difficulty: string;
          challenge_type: string;
          starter_code: Json;
          test_cases: Json;
          rubric_criteria: Json;
          time_limit_sec: number;
          points: number;
          sponsor_name: string | null;
          sponsor_logo: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          title: string;
          slug: string;
          description: string;
          difficulty?: string;
          challenge_type?: string;
          starter_code?: Json;
          test_cases?: Json;
          rubric_criteria?: Json;
          time_limit_sec?: number;
          points?: number;
          sponsor_name?: string | null;
          sponsor_logo?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          difficulty?: string;
          challenge_type?: string;
          starter_code?: Json;
          test_cases?: Json;
          rubric_criteria?: Json;
          time_limit_sec?: number;
          points?: number;
          sponsor_name?: string | null;
          sponsor_logo?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          submission_type: string;
          code: string | null;
          language: string | null;
          artifacts: Json;
          status: string;
          score: number;
          execution_time_ms: number | null;
          test_results: Json;
          evaluator_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          submission_type?: string;
          code?: string | null;
          language?: string | null;
          artifacts?: Json;
          status?: string;
          score?: number;
          execution_time_ms?: number | null;
          test_results?: Json;
          evaluator_feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          submission_type?: string;
          code?: string | null;
          language?: string | null;
          artifacts?: Json;
          status?: string;
          score?: number;
          execution_time_ms?: number | null;
          test_results?: Json;
          evaluator_feedback?: string | null;
          created_at?: string;
        };
      };
      campuses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          tier: string;
          city: string | null;
          state: string | null;
          logo_url: string | null;
          banner_url: string | null;
          description: string | null;
          is_verified: boolean;
          stats: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          domain?: string | null;
          tier?: string;
          city?: string | null;
          state?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          description?: string | null;
          is_verified?: boolean;
          stats?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          domain?: string | null;
          tier?: string;
          city?: string | null;
          state?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          description?: string | null;
          is_verified?: boolean;
          stats?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      campus_members: {
        Row: {
          id: string;
          campus_id: string;
          user_id: string;
          role: string;
          is_approved: boolean;
          roll_number: string | null;
          batch_year: number | null;
          department: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campus_id: string;
          user_id: string;
          role?: string;
          is_approved?: boolean;
          roll_number?: string | null;
          batch_year?: number | null;
          department?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          campus_id?: string;
          user_id?: string;
          role?: string;
          is_approved?: boolean;
          roll_number?: string | null;
          batch_year?: number | null;
          department?: string | null;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          banner_url: string | null;
          website_url: string | null;
          description: string | null;
          industry: string | null;
          company_size: string | null;
          headquarters: string | null;
          is_verified: boolean;
          verification_doc_url: string | null;
          tier: string;
          message_allowance: number;
          messages_sent_this_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          banner_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          industry?: string | null;
          company_size?: string | null;
          headquarters?: string | null;
          is_verified?: boolean;
          verification_doc_url?: string | null;
          tier?: string;
          message_allowance?: number;
          messages_sent_this_month?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          industry?: string | null;
          company_size?: string | null;
          headquarters?: string | null;
          is_verified?: boolean;
          verification_doc_url?: string | null;
          tier?: string;
          message_allowance?: number;
          messages_sent_this_month?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          role?: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string;
          role?: string;
          is_approved?: boolean;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          creator_id: string | null;
          title: string;
          slug: string;
          description: string;
          job_type: string;
          workplace_type: string;
          location: string | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          experience_level: string | null;
          required_skills: Json;
          min_verified_score: number;
          status: string;
          is_promoted: boolean;
          target_campuses: Json;
          application_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          creator_id?: string | null;
          title: string;
          slug: string;
          description: string;
          job_type?: string;
          workplace_type?: string;
          location?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          experience_level?: string | null;
          required_skills?: Json;
          min_verified_score?: number;
          status?: string;
          is_promoted?: boolean;
          target_campuses?: Json;
          application_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          creator_id?: string | null;
          title?: string;
          slug?: string;
          description?: string;
          job_type?: string;
          workplace_type?: string;
          location?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          experience_level?: string | null;
          required_skills?: Json;
          min_verified_score?: number;
          status?: string;
          is_promoted?: boolean;
          target_campuses?: Json;
          application_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          user_id: string;
          status: string;
          resume_url: string | null;
          cover_letter: string | null;
          verified_match_score: number;
          custom_responses: Json;
          recruiter_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          user_id: string;
          status?: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          verified_match_score?: number;
          custom_responses?: Json;
          recruiter_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          user_id?: string;
          status?: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          verified_match_score?: number;
          custom_responses?: Json;
          recruiter_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          event_type: string;
          host_type: string;
          company_id: string | null;
          campus_id: string | null;
          organizer_id: string | null;
          start_time: string;
          end_time: string;
          location_type: string;
          location: string | null;
          virtual_meeting_url: string | null;
          banner_url: string | null;
          capacity: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          event_type?: string;
          host_type?: string;
          company_id?: string | null;
          campus_id?: string | null;
          organizer_id?: string | null;
          start_time: string;
          end_time: string;
          location_type?: string;
          location?: string | null;
          virtual_meeting_url?: string | null;
          banner_url?: string | null;
          capacity?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          event_type?: string;
          host_type?: string;
          company_id?: string | null;
          campus_id?: string | null;
          organizer_id?: string | null;
          start_time?: string;
          end_time?: string;
          location_type?: string;
          location?: string | null;
          virtual_meeting_url?: string | null;
          banner_url?: string | null;
          capacity?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
        };
      };
      message_threads: {
        Row: {
          id: string;
          participant_ids: string[];
          subject: string | null;
          context_type: string | null;
          context_id: string | null;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_ids: string[];
          subject?: string | null;
          context_type?: string | null;
          context_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_ids?: string[];
          subject?: string | null;
          context_type?: string | null;
          context_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          content: string;
          attachments: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          content: string;
          attachments?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          sender_id?: string;
          content?: string;
          attachments?: Json;
          is_read?: boolean;
          created_at?: string;
        };
      };
      mentors: {
        Row: {
          id: string;
          user_id: string;
          expertise_areas: string[];
          current_company: string | null;
          current_title: string | null;
          years_of_experience: number;
          hourly_rate: number;
          currency: string;
          bio: string | null;
          availability_slots: Json;
          rating: number;
          review_count: number;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          expertise_areas?: string[];
          current_company?: string | null;
          current_title?: string | null;
          years_of_experience?: number;
          hourly_rate?: number;
          currency?: string;
          bio?: string | null;
          availability_slots?: Json;
          rating?: number;
          review_count?: number;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          expertise_areas?: string[];
          current_company?: string | null;
          current_title?: string | null;
          years_of_experience?: number;
          hourly_rate?: number;
          currency?: string;
          bio?: string | null;
          availability_slots?: Json;
          rating?: number;
          review_count?: number;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      mentor_bookings: {
        Row: {
          id: string;
          mentor_id: string;
          mentee_id: string;
          scheduled_at: string;
          duration_min: number;
          status: string;
          topic: string;
          notes: string | null;
          meeting_link: string | null;
          price_paid: number;
          review_rating: number | null;
          review_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mentor_id: string;
          mentee_id: string;
          scheduled_at: string;
          duration_min?: number;
          status?: string;
          topic: string;
          notes?: string | null;
          meeting_link?: string | null;
          price_paid?: number;
          review_rating?: number | null;
          review_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mentor_id?: string;
          mentee_id?: string;
          scheduled_at?: string;
          duration_min?: number;
          status?: string;
          topic?: string;
          notes?: string | null;
          meeting_link?: string | null;
          price_paid?: number;
          review_rating?: number | null;
          review_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          description: string;
          content: string;
          author_id: string | null;
          difficulty: string;
          estimated_read_time_min: number;
          tags: string[];
          external_link: string | null;
          is_published: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: string;
          description: string;
          content: string;
          author_id?: string | null;
          difficulty?: string;
          estimated_read_time_min?: number;
          tags?: string[];
          external_link?: string | null;
          is_published?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          description?: string;
          content?: string;
          author_id?: string | null;
          difficulty?: string;
          estimated_read_time_min?: number;
          tags?: string[];
          external_link?: string | null;
          is_published?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          details: string | null;
          status: string;
          resolution_notes: string | null;
          resolved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          details?: string | null;
          status?: string;
          resolution_notes?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: string;
          target_id?: string;
          reason?: string;
          details?: string | null;
          status?: string;
          resolution_notes?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string | null;
          user_id: string | null;
          plan_tier: string;
          provider: string;
          external_customer_id: string | null;
          external_subscription_id: string | null;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          user_id?: string | null;
          plan_tier?: string;
          provider?: string;
          external_customer_id?: string | null;
          external_subscription_id?: string | null;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          user_id?: string | null;
          plan_tier?: string;
          provider?: string;
          external_customer_id?: string | null;
          external_subscription_id?: string | null;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
