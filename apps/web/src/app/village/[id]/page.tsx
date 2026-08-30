import React from 'react';
import { VillageDossierClient } from './VillageDossierClient';
import { LOCATIONS } from '@/data/locations';

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({
    id: loc.id,
  }));
}

export default function VillageDossierPage({ params }: { params: { id: string } }) {
  return <VillageDossierClient params={params} />;
}
