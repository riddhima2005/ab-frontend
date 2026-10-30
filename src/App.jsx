import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    control_conversions: 493,
    control_visitors: 5000,
    treatment_conversions: 590,
    treatment_visitors: 5000,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key, value) => setForm({ ...form, [key]: Number(value) });

  const runTest = async () => {
    setError("");
    try {
      const res = await fetch("https://ab-backend-15wf.onrender.com/ab-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server returned " + res.status);
      setResult(await res.json());
    } catch (e) {
      setError("Could not reach the backend. Is uvicorn running? " + e.message);
    }
  };

  const fields = [
    ["control_conversions", "Control conversions"],
    ["control_visitors", "Control visitors"],
    ["treatment_conversions", "Treatment conversions"],
    ["treatment_visitors", "Treatment visitors"],
  ];

  const maxRate = result ? Math.max(result.control_rate, result.treatment_rate) : 1;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>A/B Test Checker</h1>
      <p style={{ color: "#666" }}>The first run may take 30 to 60 seconds while the free server wakes up.</p>

      {fields.map(([key, label]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <label>{label}: </label>
          <input
            type="number"
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
          />
        </div>
      ))}

      <button onClick={runTest}>Run test</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>{result.conclusion}</h2>

          {[
            ["Control", result.control_rate],
            ["Treatment", result.treatment_rate],
          ].map(([name, rate]) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <div>{name}: {(rate * 100).toFixed(2)}%</div>
              <div style={{ background: "#eee", height: 20 }}>
                <div
                  style={{
                    width: `${(rate / maxRate) * 100}%`,
                    height: 20,
                    background: name === "Treatment" ? "#2a9d8f" : "#999",
                  }}
                />
              </div>
            </div>
          ))}

          <p>
            Estimated lift: {(result.difference * 100).toFixed(2)} points
            (95% range: {(result.ci_low * 100).toFixed(2)} to{" "}
            {(result.ci_high * 100).toFixed(2)})
          </p>
          <p>p-value: {result.p_value}</p>
        </div>
      )}
    </div>
  );
}
         
                                  
                  
                
                 
                
               
     
