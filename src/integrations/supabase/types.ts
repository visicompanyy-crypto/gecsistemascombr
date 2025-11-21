export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cost_centers: {
        Row: {
          annual_budget: number | null
          code: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          monthly_budget: number | null
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_budget?: number | null
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_budget?: number | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_budget?: number | null
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_budget?: number | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          type: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          type: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          attachment_url: string[] | null
          bank_account: string | null
          category: string | null
          cost_center_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          document_number: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          metadata: Json | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          project_id: string | null
          recurrence_end_date: string | null
          recurrence_frequency: string | null
          responsible_user_id: string | null
          status: string
          tags: string[] | null
          team_member_id: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          attachment_url?: string[] | null
          bank_account?: string | null
          category?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          responsible_user_id?: string | null
          status: string
          tags?: string[] | null
          team_member_id?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          attachment_url?: string[] | null
          bank_account?: string | null
          category?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          responsible_user_id?: string | null
          status?: string
          tags?: string[] | null
          team_member_id?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_cost_center"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_team_member"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          department: string | null
          email: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          monthly_cost: number | null
          name: string
          phone: string | null
          role: string | null
          salary: number | null
          termination_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_cost?: number | null
          name: string
          phone?: string | null
          role?: string | null
          salary?: number | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_cost?: number | null
          name?: string
          phone?: string | null
          role?: string | null
          salary?: number | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
