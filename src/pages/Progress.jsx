import { useState } from "react";
import { api } from "../services/api";
import {
  Card,
  Heading,
  Button,
  useLoad,
  LoadState,
  tones,
} from "../components/UI";
export default function Progress() {
  const state = useLoad(() => api("checkins"));
  const [range, setRange] = useState("7"),
    [history, setHistory] = useState(false),
    [start, setStart] = useState(""),
    [end, setEnd] = useState("");
  const today = new Date();
  const filtered = (state.data || []).filter((c) => {
    const date = new Date(c.createdAt);
    return range === "custom"
      ? (!start || date >= new Date(start)) &&
          (!end || date <= new Date(`${end}T23:59:59`))
      : date >= new Date(today.getTime() - Number(range) * 86400000);
  });
  const series = ["mood", "stress", "sleep", "anxiety"];
  const colors = ["#087d76", "#ef9c82", "#8580ba", "#c1a84d"];
  return (
    <>
      <Heading eyebrow="YOUR PROGRESS" title="Notice your patterns.">
        A private view of your check-ins, without judgement.
      </Heading>
      <div className="actions">
        {[
          ["7", "7 days"],
          ["30", "30 days"],
          ["custom", "Custom"],
        ].map(([v, t]) => (
          <Button key={v} secondary={range !== v} onClick={() => setRange(v)}>
            {t}
          </Button>
        ))}
      </div>
      {range === "custom" && (
        <div className="actions">
          <label>
            From{" "}
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            To{" "}
            <input
              type="date"
              value={end}
              min={start}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>
      )}
      <LoadState state={state}>
        <div className="split section">
          <Card>
            <h2>This period</h2>
            <p>Mood and stress check-ins</p>
            {filtered.length ? (
              <>
                <svg
                  role="img"
                  aria-label="Mood and stress scores from 1 to 5 over the selected period"
                  viewBox="0 0 620 240"
                >
                  <title>Check-in trends</title>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <g key={n}>
                      <line
                        x1="30"
                        x2="600"
                        y1={220 - (n - 1) * 45}
                        y2={220 - (n - 1) * 45}
                        stroke="#e4eae7"
                      />
                      <text x="8" y={224 - (n - 1) * 45} fontSize="12">
                        {n}
                      </text>
                    </g>
                  ))}
                  {series.slice(0, 2).map((key, i) => (
                    <g key={key}>
                      <polyline
                        fill="none"
                        stroke={colors[i]}
                        strokeWidth="3"
                        points={filtered
                          .map(
                            (c, index) =>
                              `${filtered.length === 1 ? 315 : 30 + (index * 570) / (filtered.length - 1)},${220 - (c[key] - 1) * 45}`,
                          )
                          .join(" ")}
                      />
                      {filtered.map((c, index) => (
                        <circle
                          key={c.id}
                          cx={
                            filtered.length === 1
                              ? 315
                              : 30 + (index * 570) / (filtered.length - 1)
                          }
                          cy={220 - (c[key] - 1) * 45}
                          r="4"
                          fill={colors[i]}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
                <p>
                  <span style={{ color: colors[0] }}>● Mood</span> ·{" "}
                  <span style={{ color: colors[1] }}>● Stress</span>
                </p>
              </>
            ) : (
              <p>
                No check-ins in this period. Save a check-in to see your
                patterns.
              </p>
            )}
          </Card>
          <Card tone="mint">
            <h2>Understand the view</h2>
            <p>Your patterns can help you notice what changes over time.</p>
            <p>Patterns are observations, not diagnoses.</p>
            <Button secondary onClick={() => setHistory(!history)}>
              {history ? "Hide" : "View"} history
            </Button>
          </Card>
        </div>
        <h2>Your four check-in areas</h2>
        <div className="grid four">
          {series.map((key, i) => (
            <Card tone={tones[i]} key={key}>
              <h3 className="capitalize">{key}</h3>
              <strong className="stat">
                {filtered.length
                  ? (
                      filtered.reduce((sum, c) => sum + c[key], 0) /
                      filtered.length
                    ).toFixed(1)
                  : "—"}
              </strong>
              <p>Average out of 5</p>
              <small>
                {key === "stress" || key === "anxiety"
                  ? "Higher = more reported difficulty"
                  : "Higher = better reported wellbeing"}
              </small>
            </Card>
          ))}
        </div>
        {history && (
          <div className="table-wrap section">
            <table>
              <caption>Check-in history</caption>
              <thead>
                <tr>
                  <th>Date</th>
                  {series.map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    {series.map((k) => (
                      <td key={k}>{c[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LoadState>
    </>
  );
}
