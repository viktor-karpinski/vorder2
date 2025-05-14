'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = ({children}) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Remove 'dashboard' from segments if it’s the first one
  const withoutDashboard = segments[0] === 'workspace' ? segments.slice(1) : segments;

  return (
    <nav style={{ display: 'flex', gap: '0.5rem' }}>
      <aside>
        <Link href="/dashboard">WS:</Link>
        {withoutDashboard.map((segment, index) => {
            const href = '/workspace/' + withoutDashboard.slice(0, index + 1).join('/');
            return (
                <Link href={href} key={href}>{segment} /</Link>
            );
        })}
      </aside>
      <div className='action'>
        {children}
      </div>
    </nav>
  );
};

export default Navigation;
