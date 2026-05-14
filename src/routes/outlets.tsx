import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import OutletsList from '@/features/outlets/OutletsList';

export const Route = createFileRoute('/outlets')({
  component: () => (
    <AppShell title="Outlets Info" showBack onBack={() => window.history.back()}>
      <OutletsList />
    </AppShell>
  ),
});
