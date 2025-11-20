'use client';

import Link from 'next/link';

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </Link>
  );
}

