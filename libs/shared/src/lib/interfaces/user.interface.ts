export enum UserRole {
  Follower = 'Follower',       // iemand die andere kan volgen en berichten sturen
  Streamer = 'Streamer',       // iemand die zichzelf transparant maakt
  Admin = 'Admin',             // optioneel: beheerder
  Unknown = 'Unknown'
}
export enum UserGender {
  Male = 'Male',
  Female = 'Female',
  None = 'None',
  Unknown = 'Unknown'
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  slogan?: string;
  avatarUrl?: string;
  createdAt: string;
  gender?: UserGender;
  role: UserRole;
  followedStreamers?: any[];
  rewardSatoshi?: number;
}
