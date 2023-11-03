import type { PropsWithChildren } from "react";

export function Layout(props: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen overflow-hidden border-x border-slate-400 md:max-w-2xl">
      {props.children}
    </div>
  );
}
