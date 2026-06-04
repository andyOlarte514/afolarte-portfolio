export interface WorkEntry {
  readonly company: string;
  readonly role: string;
  readonly dateRange: string;
  readonly description?: string | undefined;
  readonly bullets: readonly string[];
  readonly tags?: readonly string[] | undefined;
  readonly companyInitials: string;
  readonly avatarColor: string;
}
