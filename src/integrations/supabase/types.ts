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
      clients: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
          pix_key: string
          pix_key_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          pix_key: string
          pix_key_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          pix_key?: string
          pix_key_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          created_by: string
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_id: string | null
          company_name: string
          created_at: string
          id: string
          logo_url: string | null
          onboarding_completed: boolean | null
          primary_color: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          company_name: string
          created_at?: string
          id?: string
          logo_url?: string | null
          onboarding_completed?: boolean | null
          primary_color?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          company_name?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          onboarding_completed?: boolean | null
          primary_color?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          annual_budget: number | null
          code: string | null
          company_id: string | null
          created_at: string | null
          custom_column_id: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          monthly_budget: number | null
          name: string
          parent_id: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annual_budget?: number | null
          code?: string | null
          company_id?: string | null
          created_at?: string | null
          custom_column_id?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_budget?: number | null
          name: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annual_budget?: number | null
          code?: string | null
          company_id?: string | null
          created_at?: string | null
          custom_column_id?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          monthly_budget?: number | null
          name?: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_centers_custom_column_id_fkey"
            columns: ["custom_column_id"]
            isOneToOne: false
            referencedRelation: "custom_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_centers_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_column_cost_centers: {
        Row: {
          cost_center_id: string
          created_at: string | null
          custom_column_id: string
          id: string
        }
        Insert: {
          cost_center_id: string
          created_at?: string | null
          custom_column_id: string
          id?: string
        }
        Update: {
          cost_center_id?: string
          created_at?: string | null
          custom_column_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_column_cost_centers_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_column_cost_centers_custom_column_id_fkey"
            columns: ["custom_column_id"]
            isOneToOne: false
            referencedRelation: "custom_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_columns: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string | null
          id: string
          is_main: boolean | null
          name: string
          order_index: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          name: string
          order_index?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          name?: string
          order_index?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_columns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
          client_id: string | null
          company_id: string | null
          cost_center_id: string | null
          created_at: string | null
          custom_column_id: string | null
          deleted_at: string | null
          description: string
          document_number: string | null
          due_date: string | null
          first_installment_date: string | null
          id: string
          installment_number: number | null
          is_installment: boolean | null
          is_recurring: boolean | null
          metadata: Json | null
          notes: string | null
          parent_transaction_id: string | null
          payment_date: string | null
          payment_method: string | null
          pix_key: string | null
          pix_recipient_name: string | null
          project_id: string | null
          purchase_date: string | null
          recurrence_end_date: string | null
          recurrence_frequency: string | null
          responsible_user_id: string | null
          status: string
          tags: string[] | null
          team_member_id: string | null
          total_installments: number | null
          transaction_classification: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          attachment_url?: string[] | null
          bank_account?: string | null
          category?: string | null
          client_id?: string | null
          company_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          custom_column_id?: string | null
          deleted_at?: string | null
          description: string
          document_number?: string | null
          due_date?: string | null
          first_installment_date?: string | null
          id?: string
          installment_number?: number | null
          is_installment?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          pix_key?: string | null
          pix_recipient_name?: string | null
          project_id?: string | null
          purchase_date?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          responsible_user_id?: string | null
          status: string
          tags?: string[] | null
          team_member_id?: string | null
          total_installments?: number | null
          transaction_classification?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          attachment_url?: string[] | null
          bank_account?: string | null
          category?: string | null
          client_id?: string | null
          company_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          custom_column_id?: string | null
          deleted_at?: string | null
          description?: string
          document_number?: string | null
          due_date?: string | null
          first_installment_date?: string | null
          id?: string
          installment_number?: number | null
          is_installment?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          pix_key?: string | null
          pix_recipient_name?: string | null
          project_id?: string | null
          purchase_date?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          responsible_user_id?: string | null
          status?: string
          tags?: string[] | null
          team_member_id?: string | null
          total_installments?: number | null
          transaction_classification?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_custom_column_id_fkey"
            columns: ["custom_column_id"]
            isOneToOne: false
            referencedRelation: "custom_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
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
      subscriptions: {
        Row: {
          asaas_customer_id: string | null
          asaas_subscription_id: string | null
          billing_cycle: string
          created_at: string | null
          id: string
          next_due_date: string | null
          plan_id: string
          plan_name: string
          status: string | null
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          billing_cycle: string
          created_at?: string | null
          id?: string
          next_due_date?: string | null
          plan_id: string
          plan_name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          billing_cycle?: string
          created_at?: string | null
          id?: string
          next_due_date?: string | null
          plan_id?: string
          plan_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          company_id: string | null
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
          user_id: string
        }
        Insert: {
          company_id?: string | null
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
          user_id: string
        }
        Update: {
          company_id?: string | null
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
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_tool_expenses: {
        Row: {
          amount: number
          company_id: string | null
          cost_center_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          entity_name: string
          expense_date: string
          expense_type: string
          id: string
          metadata: Json | null
          notes: string | null
          payment_method: string | null
          status: string
          team_member_id: string | null
          tool_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          company_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          entity_name: string
          expense_date: string
          expense_type: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_method?: string | null
          status: string
          team_member_id?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          entity_name?: string
          expense_date?: string
          expense_type?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_method?: string | null
          status?: string
          team_member_id?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_tool_expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_tool_expenses_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_tool_expenses_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_tool_expenses_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools_software"
            referencedColumns: ["id"]
          },
        ]
      }
      tools_software: {
        Row: {
          billing_frequency: string | null
          category: string | null
          company_id: string | null
          cost_per_license: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          license_type: string | null
          metadata: Json | null
          name: string
          provider: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_frequency?: string | null
          category?: string | null
          company_id?: string | null
          cost_per_license?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          name: string
          provider?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_frequency?: string | null
          category?: string | null
          company_id?: string | null
          cost_per_license?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          name?: string
          provider?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_software_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_main_column_for_user: {
        Args: { p_company_id?: string; p_user_id: string }
        Returns: string
      }
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
