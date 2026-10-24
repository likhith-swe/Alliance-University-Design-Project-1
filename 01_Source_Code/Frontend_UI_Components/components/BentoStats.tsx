import { KPI_DATA } from "../data/campusData";
import KpiCard from "./KpiCard";

export default function BentoStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {KPI_DATA.map((k, i) => (
        <KpiCard key={k.id} {...k} className={i === 0 ? "lg:col-span-2" : ""} />
      ))}
    </div>
  );
}
