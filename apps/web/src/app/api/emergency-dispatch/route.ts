import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const {
      location = 'Raini Village / Rishiganga Basin',
      riskScore = 82,
      riskLevel = 'HIGH',
      leadTimeMinutes = 42,
      targetWards = ['Ward 1 (Riverbed Cluster)', 'Ward 4 (Low Upland)'],
      dispatchChannels = ['TWILIO_SMS', 'CAP_BROADCAST', 'VILLAGE_SIREN_MESH', 'WHATSAPP_GOV'],
    } = body;

    // Simulate multi-channel emergency broadcast processing
    const dispatchId = `DISPATCH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const result = {
      success: true,
      dispatchId,
      timestamp,
      protocol: 'CAP-v1.2-OASIS-COMPLIANT',
      incident: {
        hazardType: 'FLASH_FLOOD_SURGE',
        severity: riskLevel === 'EXTREME' ? 'EXTREME' : 'SEVERE',
        certainty: 'OBSERVED_HYDRODYNAMIC_CONVERGENCE',
        urgency: 'IMMEDIATE',
        leadTimeMinutes,
        location,
        riskScore,
      },
      channels: {
        twilioSms: {
          status: 'DELIVERED',
          recipientsNotified: 1420,
          deliveredRate: '99.4%',
          gatewayResponseCode: 200,
          sampleMessage: `[EMERGENCY 112] FLASH FLOOD EVACUATION ORDER for ${location}. 42 Min lead time. Evacuate uphill immediately to Govt. High School. Avoid riverbed.`
        },
        capBroadcastMesh: {
          status: 'ACTIVE_TRANSMITTING',
          frequencyHz: '868.1 MHz LoRa',
          sirenMeshActivated: true,
          sirenDecibels: 110,
        },
        whatsappGovAlert: {
          status: 'QUEUED_DELIVERY',
          subscribers: 2840,
        }
      },
      designatedAssemblyShelter: {
        name: 'Govt. High School Assembly Ground',
        elevationGainMeters: '+120m',
        distanceKm: '1.4 km',
        capacity: 650,
        currentOccupancy: 42,
      }
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Emergency dispatch gateway failure' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OPERATIONAL',
    service: 'FloodGuard Common Alerting Protocol (CAP) & Twilio Telephony Dispatch Gateway',
    version: '2.4.0',
    endpoints: {
      dispatch: 'POST /api/emergency-dispatch',
      health: 'GET /api/emergency-dispatch'
    },
    activeCarriers: ['Airtel Core', 'Jio Emergency Cell Broadcast', 'BSNL Disaster Net'],
    meshSensorsLinked: 18,
  });
}
