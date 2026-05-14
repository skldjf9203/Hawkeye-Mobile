import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import PosmList from '@/features/posm/PosmList';

export const Route = createFileRoute('/posm')({
  component: () => (
    <AppShell title="Stands Executions" showBack onBack={() => window.history.back()}>
      <PosmList />
    </AppShell>
  ),
});
