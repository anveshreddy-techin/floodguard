/**
 * rolePermissions.ts
 * Central Role-Based Access Control (RBAC) configuration for FloodGuard AI.
 * Maps each UserRole to: allowed navigation hubs, allowed sub-apps, UI flags, and display metadata.
 */

import { UserRole } from '@/context/AdaptiveContext';

export interface RolePermissions {
  label: string;
  emoji: string;
  description: string;
  allowedHubs: string[];
  allowedApps: string[];
  citizenMode: boolean;
  canSeeRawData: boolean;
  canSeeCommandCenter: boolean;
  canUploadData: boolean;
  canAccessAdmin: boolean;
  accessLevel: 1 | 2 | 3 | 4 | 5 | 6;
}

const ALL_HUBS = ['hub-ops', 'hub-gis', 'hub-met', 'hub-forensics', 'hub-gov'];

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  CITIZEN: {
    label: 'Citizen / Resident',
    emoji: '🏠',
    description: 'Safety alerts, shelter locator & emergency contacts for your area',
    allowedHubs: ['hub-ops', 'hub-gov'],
    allowedApps: ['safety', 'public-portal', 'dashboard-alerts'],
    citizenMode: true,
    canSeeRawData: false,
    canSeeCommandCenter: false,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 1,
  },
  VIEWER: {
    label: 'Public Viewer',
    emoji: '👁️',
    description: 'Read-only public access to safety info and alerts',
    allowedHubs: ['hub-ops', 'hub-gov'],
    allowedApps: ['safety', 'public-portal', 'dashboard-alerts'],
    citizenMode: true,
    canSeeRawData: false,
    canSeeCommandCenter: false,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 1,
  },
  VILLAGE_OPERATOR: {
    label: 'Village Operator',
    emoji: '🌾',
    description: 'Village-level situational awareness, alerts, and basic maps',
    allowedHubs: ['hub-ops', 'hub-gis', 'hub-met', 'hub-gov'],
    allowedApps: ['overview', 'dashboard-alerts', 'safety', 'village', 'weather', 'sensors', 'public-portal'],
    citizenMode: false,
    canSeeRawData: false,
    canSeeCommandCenter: true,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 2,
  },
  FIELD_RESPONDER: {
    label: 'Field Responder',
    emoji: '🚒',
    description: 'Emergency operations, rescue SOPs, safety HUD & field coordination',
    allowedHubs: ['hub-ops', 'hub-gis', 'hub-met'],
    allowedApps: ['overview', 'dashboard-alerts', 'role-workspace', 'safety', 'map', 'village', 'weather', 'sensors'],
    citizenMode: false,
    canSeeRawData: false,
    canSeeCommandCenter: true,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 2,
  },
  MEDICAL_OFFICER: {
    label: 'Medical Officer',
    emoji: '🏥',
    description: 'Casualty management, medical resource allocation & shelter health',
    allowedHubs: ['hub-ops', 'hub-met', 'hub-gov'],
    allowedApps: ['overview', 'dashboard-alerts', 'role-workspace', 'safety', 'weather', 'public-portal'],
    citizenMode: false,
    canSeeRawData: false,
    canSeeCommandCenter: true,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 2,
  },
  DISTRICT_OPERATOR: {
    label: 'District EOC Operator',
    emoji: '🏛️',
    description: 'District Emergency Operations — GIS, cascade simulation & resource dispatch',
    allowedHubs: ['hub-ops', 'hub-gis', 'hub-met', 'hub-gov'],
    allowedApps: [
      'overview', 'dashboard-alerts', 'role-workspace', 'safety',
      'map', 'river-basins', 'cascade', 'village',
      'weather', 'sensors', 'upload',
      'public-portal',
    ],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: true,
    canUploadData: true,
    canAccessAdmin: false,
    accessLevel: 3,
  },
  STATE_OPERATOR: {
    label: 'State SEOC Commander',
    emoji: '🏢',
    description: 'State-level coordination — multi-district command & prediction ledger',
    allowedHubs: ALL_HUBS,
    allowedApps: [
      'overview', 'dashboard-alerts', 'role-workspace', 'safety',
      'map', 'river-basins', 'cascade', 'village',
      'weather', 'sensors', 'upload',
      'hindcast', 'benchmark', 'ledger',
      'public-portal',
    ],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: true,
    canUploadData: true,
    canAccessAdmin: false,
    accessLevel: 4,
  },
  NATIONAL_OPERATOR: {
    label: 'National NDMA Commander',
    emoji: '🇮🇳',
    description: 'Pan-national command, cross-border coordination & NDMA oversight',
    allowedHubs: ALL_HUBS,
    allowedApps: [
      'overview', 'dashboard-alerts', 'role-workspace', 'safety',
      'map', 'river-basins', 'cascade', 'village',
      'weather', 'sensors', 'upload',
      'hindcast', 'benchmark', 'ledger',
      'model-monitoring', 'public-portal',
    ],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: true,
    canUploadData: true,
    canAccessAdmin: false,
    accessLevel: 5,
  },
  ANALYST: {
    label: 'GIS / ML Analyst',
    emoji: '📊',
    description: 'Geospatial analysis, ML model evaluation, forensics & data pipelines',
    allowedHubs: ['hub-gis', 'hub-met', 'hub-forensics', 'hub-gov'],
    allowedApps: [
      'map', 'river-basins', 'cascade', 'village',
      'weather', 'sensors', 'upload',
      'hindcast', 'benchmark', 'ledger',
      'model-monitoring',
    ],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: false,
    canUploadData: true,
    canAccessAdmin: false,
    accessLevel: 4,
  },
  RESEARCHER: {
    label: 'Researcher',
    emoji: '🔬',
    description: 'Historical data, hindcast forensics, benchmarking & model research',
    allowedHubs: ['hub-gis', 'hub-met', 'hub-forensics'],
    allowedApps: [
      'map', 'river-basins', 'village',
      'weather', 'sensors',
      'hindcast', 'benchmark', 'ledger',
      'model-monitoring',
    ],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: false,
    canUploadData: false,
    canAccessAdmin: false,
    accessLevel: 3,
  },
  ADMIN: {
    label: 'System Administrator',
    emoji: '⚙️',
    description: 'Full system access — all hubs, RBAC management, admin governance',
    allowedHubs: ALL_HUBS,
    allowedApps: [],
    citizenMode: false,
    canSeeRawData: true,
    canSeeCommandCenter: true,
    canUploadData: true,
    canAccessAdmin: true,
    accessLevel: 6,
  },
};

export const getRolePermissions = (role: UserRole): RolePermissions =>
  ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS['VIEWER'];

export const isHubAllowed = (role: UserRole, hubId: string, viewAll = false): boolean => {
  if (viewAll) return true;
  return getRolePermissions(role).allowedHubs.includes(hubId);
};

export const isAppAllowed = (role: UserRole, appId: string, viewAll = false): boolean => {
  if (viewAll) return true;
  const perms = getRolePermissions(role);
  if (perms.allowedApps.length === 0) return true;
  return perms.allowedApps.includes(appId);
};
