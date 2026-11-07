export function MatchRadarVisual({ strong, potential, closing, missingInfo }: { strong: number; potential: number; closing: number; missingInfo: number }) {
  const max = Math.max(1, strong, potential, closing, missingInfo, 4);
  const pt = (v: number, a: number) => {
    const r = 18 + (v / max) * 34;
    const rad = (Math.PI / 180) * a;
    return `${50 + r * Math.cos(rad)},${50 + r * Math.sin(rad)}`;
  };
  const poly = [pt(strong, -90), pt(potential, 0), pt(closing, 90), pt(missingInfo, 180)].join(" ");
  const rings = [0.33, 0.66, 1].map((s) => [pt(max*s,-90),pt(max*s,0),pt(max*s,90),pt(max*s,180)].join(" "));
  const axes = [[50,50,50,16],[50,50,84,50],[50,50,50,84],[50,50,16,50]];
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0 overflow-visible" role="img" aria-label="Scholarship match radar visualization">
        <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#233F70" stopOpacity=".55"/><stop offset="1" stopColor="#D6B56D" stopOpacity=".35"/></linearGradient></defs>
        {rings.map((r,i)=><polygon key={i} points={r} fill="none" stroke="#101C36" strokeOpacity={0.08 + i*0.04} />)}
        {axes.map((a,i)=><line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} stroke="#101C36" strokeOpacity=".1" />)}
        <polygon points={poly} fill="url(#rg)" stroke="#D6B56D" strokeWidth="1.5" />
        {[[pt(strong,-90),"#233F70"],[pt(potential,0),"#233F70"],[pt(closing,90),"#D6B56D"],[pt(missingInfo,180),"#64748B"]].map(([p,c],i)=><circle key={i} cx={String(p).split(",")[0]} cy={String(p).split(",")[1]} r="2.3" fill={String(c)} />)}
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div><span className="inline-block h-2 w-2 rounded-full bg-secondary mr-2"/>Strong: <strong>{strong}</strong></div>
        <div><span className="inline-block h-2 w-2 rounded-full bg-secondary/60 mr-2"/>Potential: <strong>{potential}</strong></div>
        <div><span className="inline-block h-2 w-2 rounded-full bg-accent mr-2"/>Closing soon: <strong>{closing}</strong></div>
        <div><span className="inline-block h-2 w-2 rounded-full bg-muted mr-2"/>Need info: <strong>{missingInfo}</strong></div>
      </div>
    </div>
  );
}
