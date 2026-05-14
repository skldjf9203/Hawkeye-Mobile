import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import ExpiryList from '@/features/expiry/ExpiryList';

export const Route = createFileRoute('/expiry')({
  component: () => (
    <AppShell title="Store Wise Expiry" showBack onBack={() => window.history.back()}>
      <ExpiryList />
    </AppShell>
  ),
});
