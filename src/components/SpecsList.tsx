import { User } from "~/pages/session/[sessionId]";

interface SpecsListProps {
  specs: User[];
  whoami: User;
}

export default function SpecsList({ specs, whoami }: SpecsListProps) {
  return (
    <div className="absolute left-8 top-24">
      <h1 className="text-lg font-semibold tracking-widest text-[#a2884f] dark:text-emerald-600">
        Espectadores da sessão
      </h1>
      <div className="flex flex-col">
        {specs.map((spec) => (
          <h1
            className="mt-2 font-medium tracking-wider text-zinc-900 dark:text-white"
            key={spec.id}
          >
            {spec.id === whoami.id ? `${spec.name} (Eu)` : spec.name}
          </h1>
        ))}
      </div>
    </div>
  );
}
