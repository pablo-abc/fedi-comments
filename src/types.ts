export type Emoji = {
  shortcode: string;
  static_url: string;
  url: string;
};

export type Account = {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  url: string;
  avatar: string;
  avatar_static: string;
  emojis: Emoji[];
};

export type Post = {
  id: string;
  created_at: string;
  uri: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  content: string;
  emojis: Emoji[];
  account: Account;
};
