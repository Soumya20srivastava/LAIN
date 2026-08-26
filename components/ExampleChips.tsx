const EXAMPLES = [
  "skibidi toilet",
  "rizz",
  "touch grass",
  "it's giving...",
  "the backrooms",
  "let him cook",
  "very demure very mindful",
  "amogus",
];

interface ExampleChipsProps {
  onPick: (example: string) => void;
}

export default function ExampleChips({ onPick }: ExampleChipsProps) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">
        example searches
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="chip" onClick={() => onPick(example)}>
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
