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
      closures: {
        Row: {
          closure_end_date: string | null
          closure_start_date: string | null
          created_at: string
          event_id: number | null
          id: number
          pool_id: number | null
          reason_for_closure: string | null
        }
        Insert: {
          closure_end_date?: string | null
          closure_start_date?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          pool_id?: number | null
          reason_for_closure?: string | null
        }
        Update: {
          closure_end_date?: string | null
          closure_start_date?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          pool_id?: number | null
          reason_for_closure?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "closures_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      locker_types: {
        Row: {
          created_at: string
          id: number
          padlock: boolean | null
          quarter_non_refundable: boolean | null
          quarter_refundable: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          padlock?: boolean | null
          quarter_non_refundable?: boolean | null
          quarter_refundable?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          padlock?: boolean | null
          quarter_non_refundable?: boolean | null
          quarter_refundable?: boolean | null
        }
        Relationships: []
      }
      municipalities: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      pools: {
        Row: {
          address: string | null
          amenities: string | null
          center_id: number | null
          coordinates: Json | null
          created_at: string
          id: number
          locker_type_id: number | null
          municipality_id: number | null
          name: string
          phone: string | null
          url: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string | null
          center_id?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: number
          locker_type_id?: number | null
          municipality_id?: number | null
          name: string
          phone?: string | null
          url?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string | null
          center_id?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: number
          locker_type_id?: number | null
          municipality_id?: number | null
          name?: string
          phone?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pools_locker_type_id_fkey"
            columns: ["locker_type_id"]
            isOneToOne: false
            referencedRelation: "locker_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pools_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
