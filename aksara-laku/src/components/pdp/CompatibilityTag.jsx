import Badge from "../common/Badge";

// Communicates which tools/software the asset is compatible with,
// inferred from the product's asset type.
const COMPATIBILITY_MAP = {
  "Canva Template": ["Canva (Free & Pro)"],
  "Copywriting PDF": ["PDF Reader", "Google Docs"],
  "Content Planner": ["Google Sheets", "Excel"],
  "Branding Kit": ["Canva (Free & Pro)", "PDF Reader"],
};

export default function CompatibilityTag({ type }) {
  const tools = COMPATIBILITY_MAP[type] || [];
  if (tools.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => (
        <Badge key={tool} tone="outline">
          {tool}
        </Badge>
      ))}
    </div>
  );
}
