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
        <div className="relative rounded-2xl border-2 border-[var(--theme-primary)] shadow-2xl bg-gradient-to-br from-[#17191b] via-[var(--theme-dark)] to-[#24282b] p-1 mx-auto"
             style={{boxShadow: "0 6px 36px 0 rgba(0,0,0,0.40), 0 1px 1px 0 #fff inset"}}
        >
          <div className="rounded-xl border border-[var(--theme-light)] shadow-inner bg-gradient-to-b from-[var(--theme-base)] via-[var(--theme-dark)] to-[var(--theme-base)] max-h-[58vh] pl-4 pt-2 pb-2 overflow-hidden"
            style={{boxShadow: "inset 0 3px 18px 0 rgba(0,0,0,0.35), inset 0 -2px 6px 0 #fff"}}
          >
            <div className="max-h-[54vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              <ul className="space-y-4">
                {analysis.map((item, index) => {
                  const category = String(item.category || '').trim();
                  const issue = String(item.issue || '').trim();
                  const key = `${generateKey(category, issue)}-${index}`;

                  return (
                    <li
                      key={key}
                      className="bg-[var(--theme-base)] rounded-lg p-4 border border-[var(--theme-light)] shadow"
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
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No concerns detected in this lease.</p>
      )}

      <div>
        <h3 className="mt-6 font-semibold text-lg">Recent State Bills</h3>
        {Array.isArray(bills) && bills.length > 0 ? (
          <ul className="ml-5 mt-2 space-y-1">
            {bills.map((bill) =>
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
            )}
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
