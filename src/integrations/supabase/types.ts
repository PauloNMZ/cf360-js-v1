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
      convenente_credentials: {
        Row: {
          app_key: string | null
          atualizado_em: string | null
          basic: string | null
          client_id: string | null
          client_secret: string | null
          convenente_id: string
          criado_em: string | null
          id: string
          password_bbsia: string | null
          registrar_token: string | null
          user_bbsia: string | null
          user_id: string | null
        }
        Insert: {
          app_key?: string | null
          atualizado_em?: string | null
          basic?: string | null
          client_id?: string | null
          client_secret?: string | null
          convenente_id: string
          criado_em?: string | null
          id?: string
          password_bbsia?: string | null
          registrar_token?: string | null
          user_bbsia?: string | null
          user_id?: string | null
        }
        Update: {
          app_key?: string | null
          atualizado_em?: string | null
          basic?: string | null
          client_id?: string | null
          client_secret?: string | null
          convenente_id?: string
          criado_em?: string | null
          id?: string
          password_bbsia?: string | null
          registrar_token?: string | null
          user_bbsia?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convenente_credentials_convenente_id_fkey"
            columns: ["convenente_id"]
            isOneToOne: false
            referencedRelation: "convenentes"
            referencedColumns: ["id"]
          },
        ]
      }
      convenentes: {
        Row: {
          agencia: string | null
          celular: string | null
          chave_pix: string | null
          cidade: string | null
          cnpj: string
          complemento: string | null
          conta: string | null
          contato: string | null
          convenio_pag: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          email: string | null
          endereco: string | null
          fone: string | null
          id: string
          numero: string | null
          razao_social: string
          uf: string | null
          user_id: string
        }
        Insert: {
          agencia?: string | null
          celular?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnpj: string
          complemento?: string | null
          conta?: string | null
          contato?: string | null
          convenio_pag?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string | null
          endereco?: string | null
          fone?: string | null
          id?: string
          numero?: string | null
          razao_social: string
          uf?: string | null
          user_id: string
        }
        Update: {
          agencia?: string | null
          celular?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnpj?: string
          complemento?: string | null
          conta?: string | null
          contato?: string | null
          convenio_pag?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string | null
          endereco?: string | null
          fone?: string | null
          id?: string
          numero?: string | null
          razao_social?: string
          uf?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorecidos: {
        Row: {
          agencia: string | null
          banco: string | null
          chavepix: string | null
          conta: string | null
          dataatualizacao: string | null
          datacriacao: string | null
          grupoid: string | null
          id: string
          inscricao: string
          nome: string
          tipochavepix: string | null
          tipoconta: string | null
          tipoinscricao: string
          user_id: string
          valorpadrao: number | null
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          chavepix?: string | null
          conta?: string | null
          dataatualizacao?: string | null
          datacriacao?: string | null
          grupoid?: string | null
          id?: string
          inscricao: string
          nome: string
          tipochavepix?: string | null
          tipoconta?: string | null
          tipoinscricao: string
          user_id: string
          valorpadrao?: number | null
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          chavepix?: string | null
          conta?: string | null
          dataatualizacao?: string | null
          datacriacao?: string | null
          grupoid?: string | null
          id?: string
          inscricao?: string
          nome?: string
          tipochavepix?: string | null
          tipoconta?: string | null
          tipoinscricao?: string
          user_id?: string
          valorpadrao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "favorecidos_grupoid_fkey"
            columns: ["grupoid"]
            isOneToOne: false
            referencedRelation: "grupos_favorecidos"
            referencedColumns: ["id"]
          },
        ]
      }
      favorecidos_grupos: {
        Row: {
          criado_em: string
          favorecido_id: string
          grupo_id: string
          id: string
          valor: number | null
        }
        Insert: {
          criado_em?: string
          favorecido_id: string
          grupo_id: string
          id?: string
          valor?: number | null
        }
        Update: {
          criado_em?: string
          favorecido_id?: string
          grupo_id?: string
          id?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "favorecidos_grupos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_favorecidos"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_favorecidos: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_pagamento: string | null
          descricao: string | null
          id: string
          nome: string
          tipo_servico_id: string | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_pagamento?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo_servico_id?: string | null
          user_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_pagamento?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo_servico_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupos_favorecidos_tipo_servico_id_fkey"
            columns: ["tipo_servico_id"]
            isOneToOne: false
            referencedRelation: "tipos_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_servico: {
        Row: {
          atualizado_em: string
          codigo: string
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          codigo: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          atualizado_em?: string
          codigo?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buscar_convenentes: {
        Args: { criterio: string }
        Returns: {
          id: string
          razao_social: string
          cnpj: string
        }[]
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
