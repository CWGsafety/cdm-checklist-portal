import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zityxrympqtmiulhklpm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdHl4cnltcHF0bWl1bGhrbHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njc2NDgsImV4cCI6MjA2ODI0MzY0OH0.m8qUgBhIASpiVwCzrb41LU11eJtol9b1YpkEKeSwSnI";
const supabase = createClient(supabaseUrl, supabaseKey);

const checklistData = {
  Client: [
    "Make suitable arrangements for managing a project",
    "Ensure other duty holders are appointed",
    "Provide pre-construction information"
  ],
  "Principal Designer": [
    "Plan, manage and monitor the pre-construction phase",
    "Coordinate health and safety",
    "Ensure designers comply with their duties"
  ],
  "Principal Contractor": [
    "Plan, manage and monitor the construction phase",
    "Liaise with the client and principal designer",
    "Prepare the construction phase plan"
  ]
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      setUser(data.user);
    }
  };

  const toggleCheck = (role, index) => {
    const key = \`\${role}-\${index}\`;
    setCompleted(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveChecklist = async () => {
    if (!projectName) return alert("Enter a project name");
    await supabase.from("checklists").insert({
      user_id: user.id,
      project_name: projectName,
      data: completed
    });
    alert("Checklist saved!");
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={signIn}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CDM 2015 Compliance Checklist</h1>
      <input placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} />
      {Object.entries(checklistData).map(([role, tasks]) => (
        <div key={role}>
          <h3>{role}</h3>
          {tasks.map((task, idx) => {
            const key = \`\${role}-\${idx}\`;
            return (
              <label key={key}>
                <input type="checkbox" checked={completed[key] || false} onChange={() => toggleCheck(role, idx)} />
                {task}
              </label>
            );
          })}
        </div>
      ))}
      <button onClick={saveChecklist}>Save Checklist</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
