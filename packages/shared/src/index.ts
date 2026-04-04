export type ChatStatus = 'active' | 'with_agent' | 'incident_open' | 'blacklisted' | 'closed';

export interface BotGlobalSettingsDto {
  botEnabled: boolean;
  maintenanceMode: boolean;
}

export interface ChatListItemDto {
  phone: string;
  pushName?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  status: ChatStatus;
  botEnabled: boolean;
  assignedTo?: string | null;
  branch?: string | null;
  currentIntent?: string | null;
}
