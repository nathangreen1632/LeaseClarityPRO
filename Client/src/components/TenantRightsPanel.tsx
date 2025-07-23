import { useRightsStore } from '../store/useRightsStore';
import { getHUDLinkByState } from '../utils/getHUDLinkByState';

function generateKey(category: string, issue: string): string {
  return `${category.trim().toLowerCase()}::${issue.trim().toLowerCase()}`;
}

function TenantRightsPanel({ state }: Readonly<{ state: string }>) {
  const { analysis, bills } = useRightsStore();

  return (
    <div className="bg-[var(--theme-base)] p-4 rounded-lg text-white space-y-6">
      <h2 className="text-xl font-bold">Tenant Rights Analysis</h2>

      {Array.isArray(analysis) && analysis.length > 0 ? (
        <div className="max-h-[59vh] overflow-y-auto pr-2 space-y-4 bg-[var(--theme-dark)] rounded-lg shadow-inner border border-[var(--theme-light)] px-3 py-2">
          <ul className="space-y-4">
            {analysis.map((item, index) => {
              const category = String(item.category || '').trim();
              const issue = String(item.issue || '').trim();
              const key = `${generateKey(category, issue)}-${index}`;

              return (
                <li
                  key={key}
                  className="bg-[var(--theme-dark)] rounded p-4 border border-[var(--theme-light)]"
                >
                  <p className="text-md text-red-500 font-semibold mb-1">
                    {index + 1}. {category}
                  </p>
                  <p className="text-white text-sm">{issue}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-gray-400">No concerns detected in this lease.</p>
      )}



      <div>
        <h3 className="mt-6 font-semibold text-lg">Recent State Bills</h3>
        {Array.isArray(bills) && bills.length > 0 ? (
          <ul className="ml-5 mt-2 space-y-1">
            {bills.map((bill) => (
              bill.link ? (
                <li key={bill.link}>
                  <a
                    href={bill.link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-400"
                  >
                    {bill.title}
                  </a>{' '}
                  – <span className="text-xs">{bill.updated.slice(0, 10)}</span>
                </li>
              ) : null
            ))}

          </ul>
        ) : (
          <p className="text-gray-400 mt-2">No relevant bills found for {state}.</p>
        )}
      </div>

      <a
        className="block mt-6 text-emerald-400 underline"
        href={getHUDLinkByState(state)}
        target="_blank"
        rel="noreferrer"
      >
        View official HUD tenant rights for {state}
      </a>
    </div>
  );
}

export default TenantRightsPanel;
