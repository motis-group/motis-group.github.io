import type { Case, FlowNode } from '@root/site/work';

const KIND = { system: 'System', person: 'Person', check: 'Check', output: 'Output' };

function Lane({ name, nodes }: { name: string; nodes: FlowNode[] }) {
  return (
    <div className="lane">
      <p className="label">{name}</p>
      <div className="flow">
        {nodes.map((n, i) => (
          <div key={i} className={`node ${n.kind}`}>
            <span className="kind">{KIND[n.kind]}</span>
            {n.label}
            {n.note ? <span className="note">{n.note}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Flow({ item, fig }: { item: Case; fig: string }) {
  return (
    <figure className="fig">
      <figcaption>
        <span className="label">
          <b>Fig. {fig}</b> · Process, before and after
        </span>
        <span className="label">{item.sector}</span>
      </figcaption>
      <Lane name="Before" nodes={item.before} />
      <Lane name="After" nodes={item.after} />
    </figure>
  );
}
