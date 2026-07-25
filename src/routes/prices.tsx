import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
const markets=[
["Gold 18K","3,452,000 Toman","3,415,000","3,438,000","3,452,000","3,426,000","3,452,000"],
["Gold 24K","4,602,000 Toman","4,550,000","4,578,000","4,602,000","4,566,000","4,602,000"],
["Silver (gram)","74,000 Toman","71,500","72,300","73,100","72,700","74,000"],
["Emami coin","41,200,000 Toman","40,400,000","40,850,000","41,000,000","40,700,000","41,200,000"],
["Half coin","22,100,000 Toman","21,700,000","21,850,000","22,000,000","21,800,000","22,100,000"],
["Quarter coin","13,100,000 Toman","12,850,000","12,920,000","13,000,000","12,900,000","13,100,000"],
["US dollar","93,500 Toman","91,800","92,200","92,900","92,400","93,500"],
];
export const Route=createFileRoute("/prices")({component:Prices,head:()=>({meta:[{title:"Market Prices | Aghli Gold"}]})});
function Prices(){return <Shell><section className="max-w-7xl mx-auto px-6 py-16"><p className="text-[11px] uppercase tracking-[.32em] text-gold">Market board</p><h1 className="mt-4 font-serif text-5xl">Gold, silver, coins & currency</h1><p className="mt-5 max-w-2xl text-onyx/65">Indicative market values and five-point history. Please contact Aghli Gold to confirm the final buy or sell price before your transaction.</p><div className="mt-12 overflow-x-auto border border-onyx/10"><table className="w-full min-w-[760px] text-left"><thead className="bg-onyx text-parchment text-[10px] uppercase tracking-widest"><tr><th className="p-5">Market</th><th className="p-5">Current</th><th className="p-5">History 1</th><th className="p-5">History 2</th><th className="p-5">History 3</th><th className="p-5">History 4</th><th className="p-5">Latest</th></tr></thead><tbody>{markets.map(([name,current,...history])=><tr key={name} className="border-t border-onyx/10"><td className="p-5 font-serif text-lg">{name}</td><td className="p-5 font-medium text-gold">{current}</td>{history.map((item,index)=><td key={index} className="p-5 text-sm text-onyx/65">{item}</td>)}</tr>)}</tbody></table></div><p className="mt-5 text-xs text-onyx/50">History points are displayed for quick trend comparison, not investment advice. Values are manually maintained and should be confirmed by phone.</p><Link to="/contact" className="mt-8 inline-block bg-onyx px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-parchment hover:bg-gold hover:text-onyx">Confirm a price</Link></section></Shell>}
