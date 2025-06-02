export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          content_type: string
          context: string | null
          created_at: string
          id: string
          prompt: string
          response: string
          user_id: string
        }
        Insert: {
          content_type: string
          context?: string | null
          created_at?: string
          id?: string
          prompt: string
          response: string
          user_id: string
        }
        Update: {
          content_type?: string
          context?: string | null
          created_at?: string
          id?: string
          prompt?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_requests: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          response?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          deal_size: number | null
          email: string | null
          id: string
          industry: string | null
          last_contact: string | null
          lead_score: number | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          stage: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          deal_size?: number | null
          email?: string | null
          id?: string
          industry?: string | null
          last_contact?: string | null
          lead_score?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          stage?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          deal_size?: number | null
          email?: string | null
          id?: string
          industry?: string | null
          last_contact?: string | null
          lead_score?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          stage?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          client_id: string | null
          completed_at: string | null
          content: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          participants: string[] | null
          scheduled_at: string | null
          subject: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          participants?: string[] | null
          scheduled_at?: string | null
          subject?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          participants?: string[] | null
          scheduled_at?: string | null
          subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          client_id: string | null
          created_at: string
          description: string | null
          expected_close_date: string | null
          id: string
          probability: number | null
          stage_id: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          ai_suggested: boolean | null
          client_id: string | null
          completed_at: string | null
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          scheduled_for: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          ai_suggested?: boolean | null
          client_id?: string | null
          completed_at?: string | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          scheduled_for: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          ai_suggested?: boolean | null
          client_id?: string | null
          completed_at?: string | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          scheduled_for?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          client_id: string
          content: string
          created_at: string | null
          id: string
          type: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string | null
          id?: string
          type: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string | null
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          contact_name: string | null
          contacted_date: string | null
          created_at: string | null
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          tags: string[] | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          company?: string | null
          contact_name?: string | null
          contacted_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          company?: string | null
          contact_name?: string | null
          contacted_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      meeting_notes: {
        Row: {
          action_items: Json | null
          ai_generated: boolean | null
          client_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          meeting_date: string | null
          meeting_title: string | null
          participants: string[] | null
          summary: string | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          ai_generated?: boolean | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meeting_date?: string | null
          meeting_title?: string | null
          participants?: string[] | null
          summary?: string | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          action_items?: Json | null
          ai_generated?: boolean | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meeting_date?: string | null
          meeting_title?: string | null
          participants?: string[] | null
          summary?: string | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          order_index: number
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          is_pro: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_pro?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_pro?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          progress: number | null
          start_date: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          escalation_rules: Json | null
          id: string
          priority: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          escalation_rules?: Json | null
          id?: string
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          escalation_rules?: Json | null
          id?: string
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
