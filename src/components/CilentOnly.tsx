"use client";

import { PropsWithChildren, useEffect, useState } from "react";

function ClientOnly({ children }: PropsWithChildren) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default ClientOnly;
