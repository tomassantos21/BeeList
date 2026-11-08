export type GameStatus = "wishlist" | "owned" | "playing" | "completed";

export type UserGame = {
  id: string;
  user_id: string;
  game_id: number;
  game_title: string;
  cover_url: string | null;
  status: GameStatus;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      user_games: {
        Row: UserGame;
        Insert: {
          id?: string;
          user_id: string;
          game_id: number;
          game_title: string;
          cover_url?: string | null;
          status: GameStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          game_id?: number;
          game_title?: string;
          cover_url?: string | null;
          status?: GameStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_games_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      game_status: GameStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
