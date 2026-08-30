import React from 'react';
import { StateClient } from './StateClient';
import { INDIAN_STATES } from '@/data/states';

export async function generateStaticParams() {
  return INDIAN_STATES.map((state) => ({
    id: state.id,
  }));
}

export default function StateDashboardPage({ params }: { params: { id: string } }) {
  return <StateClient params={params} />;
}
