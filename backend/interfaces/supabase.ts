export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instanciate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "12.2.12 (cd3cf9e)";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			civilization: {
				Row: {
					code: string;
					id: number;
					name: string;
				};
				Insert: {
					code?: string;
					id?: number;
					name?: string;
				};
				Update: {
					code?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			expansion: {
				Row: {
					code: string;
					id: number;
					name: string;
				};
				Insert: {
					code?: string;
					id?: number;
					name?: string;
				};
				Update: {
					code?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			game: {
				Row: {
					created_at: string;
					id: number;
					is_finished: boolean | null;
					map: string | null;
					map_size: string | null;
					speed: string | null;
					turns: number | null;
					victory_id: number | null;
					winner_civilization_id: number | null;
					winner_leader_id: number | null;
					winner_player: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					is_finished?: boolean | null;
					map?: string | null;
					map_size?: string | null;
					speed?: string | null;
					turns?: number | null;
					victory_id?: number | null;
					winner_civilization_id?: number | null;
					winner_leader_id?: number | null;
					winner_player?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					is_finished?: boolean | null;
					map?: string | null;
					map_size?: string | null;
					speed?: string | null;
					turns?: number | null;
					victory_id?: number | null;
					winner_civilization_id?: number | null;
					winner_leader_id?: number | null;
					winner_player?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "game_victory_id_fkey";
						columns: ["victory_id"];
						isOneToOne: false;
						referencedRelation: "victory";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_winner_civilization_id_fkey";
						columns: ["winner_civilization_id"];
						isOneToOne: false;
						referencedRelation: "civilization";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_winner_leader_id_fkey";
						columns: ["winner_leader_id"];
						isOneToOne: false;
						referencedRelation: "leader";
						referencedColumns: ["id"];
					}
				];
			};
			game_expansion: {
				Row: {
					created_at: string;
					expansion_id: number | null;
					game_id: number | null;
					id: number;
				};
				Insert: {
					created_at?: string;
					expansion_id?: number | null;
					game_id?: number | null;
					id?: number;
				};
				Update: {
					created_at?: string;
					expansion_id?: number | null;
					game_id?: number | null;
					id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "game_expansion_expansion_id_fkey";
						columns: ["expansion_id"];
						isOneToOne: false;
						referencedRelation: "expansion";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_expansion_game_id_fkey";
						columns: ["game_id"];
						isOneToOne: false;
						referencedRelation: "game";
						referencedColumns: ["id"];
					}
				];
			};
			game_gamemode: {
				Row: {
					created_at: string;
					game_id: number | null;
					gamemode_id: number | null;
					id: number;
				};
				Insert: {
					created_at?: string;
					game_id?: number | null;
					gamemode_id?: number | null;
					id?: number;
				};
				Update: {
					created_at?: string;
					game_id?: number | null;
					gamemode_id?: number | null;
					id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "game_gamemode_game_id_fkey";
						columns: ["game_id"];
						isOneToOne: false;
						referencedRelation: "game";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_gamemode_gamemode_id_fkey";
						columns: ["gamemode_id"];
						isOneToOne: false;
						referencedRelation: "gamemode";
						referencedColumns: ["id"];
					}
				];
			};
			game_mod: {
				Row: {
					created_at: string;
					game_id: number | null;
					id: number;
					mod_id: number | null;
				};
				Insert: {
					created_at?: string;
					game_id?: number | null;
					id?: number;
					mod_id?: number | null;
				};
				Update: {
					created_at?: string;
					game_id?: number | null;
					id?: number;
					mod_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "game_mod_game_id_fkey";
						columns: ["game_id"];
						isOneToOne: false;
						referencedRelation: "game";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_mod_mod_id_fkey";
						columns: ["mod_id"];
						isOneToOne: false;
						referencedRelation: "mod";
						referencedColumns: ["id"];
					}
				];
			};
			game_player: {
				Row: {
					civilization_id: number | null;
					created_at: string;
					game_id: number | null;
					id: number;
					is_human: boolean | null;
					leader_id: number | null;
					name: string | null;
				};
				Insert: {
					civilization_id?: number | null;
					created_at?: string;
					game_id?: number | null;
					id?: number;
					is_human?: boolean | null;
					leader_id?: number | null;
					name?: string | null;
				};
				Update: {
					civilization_id?: number | null;
					created_at?: string;
					game_id?: number | null;
					id?: number;
					is_human?: boolean | null;
					leader_id?: number | null;
					name?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "game_player_civilization_id_fkey";
						columns: ["civilization_id"];
						isOneToOne: false;
						referencedRelation: "civilization";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_player_game_id_fkey";
						columns: ["game_id"];
						isOneToOne: false;
						referencedRelation: "game";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "game_player_leader_id_fkey";
						columns: ["leader_id"];
						isOneToOne: false;
						referencedRelation: "leader";
						referencedColumns: ["id"];
					}
				];
			};
			gamemode: {
				Row: {
					code: string | null;
					id: number;
					name: string;
				};
				Insert: {
					code?: string | null;
					id?: number;
					name?: string;
				};
				Update: {
					code?: string | null;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			leader: {
				Row: {
					active: boolean | null;
					civilization: number | null;
					code: string;
					id: number;
					name: string;
				};
				Insert: {
					active?: boolean | null;
					civilization?: number | null;
					code?: string;
					id?: number;
					name?: string;
				};
				Update: {
					active?: boolean | null;
					civilization?: number | null;
					code?: string;
					id?: number;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "leader_civilization_fkey";
						columns: ["civilization"];
						isOneToOne: false;
						referencedRelation: "civilization";
						referencedColumns: ["id"];
					}
				];
			};
			mod: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name?: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			victory: {
				Row: {
					id: number;
					type: string;
				};
				Insert: {
					id?: number;
					type?: string;
				};
				Update: {
					id?: number;
					type?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] &
			DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
} as const;
