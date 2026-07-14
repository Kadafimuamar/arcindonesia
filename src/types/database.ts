export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          role: "admin" | "reader";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          role?: "admin" | "reader";
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string;
          role?: "admin" | "reader";
          avatar_url?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url: string | null;
          status: "draft" | "published" | "archived";
          author_id: string;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url?: string | null;
          status?: "draft" | "published" | "archived";
          author_id: string;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image_url?: string | null;
          status?: "draft" | "published" | "archived";
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_name: string;
          author_email: string;
          content: string;
          status: "visible" | "hidden";
          ip_hash: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          post_id: string;
          author_name: string;
          author_email: string;
          content: string;
          status?: "visible" | "hidden";
          ip_hash?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          author_name?: string;
          author_email?: string;
          content?: string;
          status?: "visible" | "hidden";
          ip_hash?: string | null;
          deleted_at?: string | null;
        };
      };
    };
    Functions: {
      search_posts: {
        Args: {
          search_query: string;
          page_number?: number;
          page_size?: number;
          sort_order?: "latest" | "oldest";
        };
        Returns: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url: string | null;
          status: "published";
          author_id: string;
          author_name: string;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          total_count: number;
        }[];
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
};
