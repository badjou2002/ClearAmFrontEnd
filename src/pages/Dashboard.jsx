import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API = "https://clear-am-back-end.vercel.app/api";

const s = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 50% 0%, #0c1a24 0%, #030712 70%)",
    color: "#e2e8f0",
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    background: "rgba(3,7,18,0.8)",
    backdropFilter: "blur(12px)",
  },
  navTitle: { fontSize: 18, fontWeight: 700, color: "#10b981" },
  navBadge: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.15)",
    color: "#6ee7b7",
    border: "1px solid rgba(16,185,129,0.2)",
  },
  main: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 },
  card: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  cardTitle: { fontSize: 16, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 },
  summaryRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 },
  statPill: {
    padding: "10px 18px",
    borderRadius: 10,
    background: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.12)",
    fontSize: 13,
  },
  statValue: { color: "#10b981", fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' },
  scanBtn: {
    padding: "12px 28px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #059669, #10b981)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(16,185,129,0.25)",
  },
  deleteBtn: {
    padding: "10px 22px",
    borderRadius: 10,
    background: "rgba(239,68,68,0.15)",
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid rgba(239,68,68,0.3)",
    cursor: "pointer",
    marginLeft: 12,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  searchInput: {
    flex: "1 1 200px",
    padding: "8px 14px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    minWidth: 180,
  },
  filterSelect: {
    padding: "8px 14px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  sortBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    background: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.12)",
    color: "#94a3b8",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  sortBtnActive: {
    padding: "6px 12px",
    borderRadius: 6,
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#6ee7b7",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    color: "#6b7280",
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: "0.5px",
    cursor: "pointer",
    userSelect: "none",
  },
  thActive: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(16,185,129,0.3)",
    color: "#6ee7b7",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: "0.5px",
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "middle",
  },
  hash: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 6,
    background: "rgba(16,185,129,0.1)",
    color: "#6ee7b7",
    fontSize: 11,
    fontFamily: '"JetBrains Mono", monospace',
    maxWidth: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: "#10b981",
    cursor: "pointer",
  },
  iconBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    color: "#fca5a5",
    fontSize: 13,
    cursor: "pointer",
    lineHeight: 1,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
    flexWrap: "wrap",
  },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#94a3b8",
    fontSize: 13,
    cursor: "pointer",
    minWidth: 36,
    textAlign: "center",
  },
  pageBtnActive: {
    padding: "6px 14px",
    borderRadius: 6,
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#10b981",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 36,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    padding: 48,
    color: "#6b7280",
  },
  chartContainer: { position: "relative", height: 260 },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(17,24,39,0.95)",
      titleColor: "#f1f5f9",
      bodyColor: "#10b981",
      borderColor: "rgba(16,185,129,0.3)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#6b7280" },
      grid: { color: "rgba(255,255,255,0.03)" },
    },
    y: {
      ticks: { color: "#6b7280" },
      grid: { color: "rgba(255,255,255,0.05)" },
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#94a3b8", padding: 16, usePointStyle: true },
    },
    tooltip: {
      backgroundColor: "rgba(17,24,39,0.95)",
      titleColor: "#f1f5f9",
      bodyColor: "#10b981",
      borderColor: "rgba(16,185,129,0.3)",
      borderWidth: 1,
    },
  },
};

export default function Dashboard() {
  const [tokens, setTokens] = useState(() => JSON.parse(sessionStorage.getItem("gtokens") || "null"));
  const [email, setEmail] = useState(() => sessionStorage.getItem("gemail") || "");
  const [scanResult, setScanResult] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [distribution, setDistribution] = useState([]);
  const [ecological, setEcological] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortField, setSortField] = useState("createdTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const autoScanned = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTokens = params.get("tokens");
    const urlEmail = params.get("email");

    if (urlTokens && urlEmail) {
      const decodedTokens = JSON.parse(decodeURIComponent(urlTokens));
      const decodedEmail = decodeURIComponent(urlEmail);

      sessionStorage.setItem("gtokens", JSON.stringify(decodedTokens));
      sessionStorage.setItem("gemail", decodedEmail);

      setTokens(decodedTokens);
      setEmail(decodedEmail);

      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  const getAuthConfig = useCallback(() => {
    if (!tokens) return {};
    const accessToken = tokens.access_token || tokens;
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-User-Email": email,
      },
    };
  }, [tokens, email]);

  const fetchCharts = useCallback(async () => {
    try {
      const [distRes, ecoRes] = await Promise.all([
        axios.get(`${API}/stats/distribution`),
        axios.get(`${API}/stats/ecological`),
      ]);
      setDistribution(distRes.data);
      setEcological(ecoRes.data);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  const handleScan = async () => {
    if (!tokens || !email) return;
    setScanning(true);
    setSelected(new Set());
    try {
      const { data } = await axios.post(`${API}/drive/scan`, { tokens, email });
      setScanResult(data);
    } catch (err) {
      alert("Scan failed: " + (err.response?.data?.error || err.message));
    } finally {
      setScanning(false);
    }
    fetchCharts();
  };

  useEffect(() => {
    if (tokens && email && !autoScanned.current) {
      autoScanned.current = true;
      handleScan();
    }
  }, [tokens, email]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (!scanResult?.duplicates) return;
    if (selected.size === scanResult.duplicates.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(scanResult.duplicates.map((d) => d.id)));
    }
  };

  const handleDelete = async (specificIds) => {
    const ids = specificIds || Array.from(selected);
    if (ids.length === 0 || !tokens) return;
    if (!window.confirm(`Move ${ids.length} file(s) to trash?`)) return;
    setDeleting(true);
    try {
      const { data } = await axios.post(`${API}/drive/delete`, {
        tokens,
        fileIds: ids,
        email,
      });
      setScanResult((prev) => ({
        ...prev,
        duplicateCount: (prev?.duplicateCount || 0) - ids.length,
        duplicates: (prev?.duplicates || []).filter((f) => !ids.includes(f.id)),
      }));
      setSelected(new Set());
      alert(`Deleted ${data.deletedCount} files (${data.deletedSizeGb} GB)`);
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
    fetchCharts();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gtokens");
    sessionStorage.removeItem("gemail");
    setTokens(null);
    setEmail("");
    setScanResult(null);
    navigate("/");
  };

  const filteredDuplicates = useMemo(() => {
    if (!scanResult?.duplicates) return [];
    let list = [...scanResult.duplicates];

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((f) => f.name?.toLowerCase().includes(q));
    }

    if (sizeFilter !== "all") {
      const thresholds = { "10mb": 10 * 1048576, "100mb": 100 * 1048576, "1gb": 1073741824 };
      const minSize = thresholds[sizeFilter] || 0;
      list = list.filter((f) => (parseInt(f.size, 10) || 0) >= minSize);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = (a.name || "").localeCompare(b.name || "");
      else if (sortField === "size")
        cmp = (parseInt(a.size, 10) || 0) - (parseInt(b.size, 10) || 0);
      else if (sortField === "createdTime")
        cmp = new Date(a.createdTime || 0) - new Date(b.createdTime || 0);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return list;
  }, [scanResult, searchTerm, sizeFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredDuplicates.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDuplicates = filteredDuplicates.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sizeFilter, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const renderSortArrow = (field) => {
    if (sortField !== field) return " ↕";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const barData = {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: "Users",
        data: distribution.map((d) => d.count),
        backgroundColor: "rgba(16,185,129,0.6)",
        borderColor: "rgba(16,185,129,0.9)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const cleanedGb = ecological?.cleanedGb || 0;
  const remainingGb = ecological?.estimatedRemainingWasteGb || 1000;
  const doughnutData = {
    labels: ["Cleaned Storage", "Remaining Waste"],
    datasets: [
      {
        data: [cleanedGb, remainingGb - cleanedGb],
        backgroundColor: ["rgba(16,185,129,0.8)", "rgba(107,114,128,0.2)"],
        borderColor: ["rgba(16,185,129,0.6)", "rgba(107,114,128,0.1)"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <button key={1} style={s.pageBtn} onClick={() => setCurrentPage(1)}>1</button>
      );
      if (start > 2) pages.push(<span key="dots1" style={{ color: "#6b7280", padding: "0 4px" }}>...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          style={i === safePage ? s.pageBtnActive : s.pageBtn}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2" style={{ color: "#6b7280", padding: "0 4px" }}>...</span>);
      pages.push(
        <button key={totalPages} style={s.pageBtn} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (!tokens) {
    return (
      <div style={s.container}>
        <div style={{ ...s.main, textAlign: "center", paddingTop: 120 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#f1f5f9" }}>
            Please sign in first
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            Connect your Google Drive from the landing page to begin.
          </p>
          <a
            href="/"
            style={{ color: "#10b981", textDecoration: "underline", fontWeight: 600 }}
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <span style={s.navTitle}>Clear AM Dashboard</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{email}</span>
          <span style={{ ...s.navBadge, cursor: "pointer" }} onClick={handleLogout}>
            Disconnect
          </span>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.summaryRow}>
          <div style={s.statPill}>
            Files scanned: <span style={s.statValue}>{scanResult?.totalFiles || 0}</span>
          </div>
          <div style={s.statPill}>
            Duplicates: <span style={s.statValue}>{scanResult?.duplicateCount || 0}</span>
          </div>
          <div style={s.statPill}>
            Waste identified:{" "}
            <span style={s.statValue}>{scanResult?.duplicateSizeGb || 0} GB</span>
          </div>
          <div style={s.statPill}>
            CO₂ impact: <span style={s.statValue}>{scanResult?.co2SavedKg || 0} kg</span>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <button style={s.scanBtn} onClick={handleScan} disabled={scanning}>
            {scanning ? "Scanning..." : "Scan Drive"}
          </button>
          <button
            style={s.deleteBtn}
            onClick={() => handleDelete()}
            disabled={selected.size === 0 || deleting}
          >
            {deleting ? "Moving to trash..." : `Trash (${selected.size})`}
          </button>
        </div>

        {/* <div style={s.grid2}>
          <div style={s.card}>
            <div style={s.cardTitle}>User Distribution by Cleaning</div>
            <div style={s.chartContainer}>
              {distribution.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <div style={s.empty}>No distribution data yet</div>
              )}
            </div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Ecological Impact</div>
            <div style={s.chartContainer}>
              {ecological ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div style={s.empty}>No ecological data yet</div>
              )}
            </div>
          </div>
        </div> */}

        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={s.cardTitle}>Duplicate Files</div>
            <label style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                style={s.checkbox}
                onChange={selectAll}
                checked={scanResult?.duplicates?.length > 0 && selected.size === scanResult.duplicates.length}
              />
              Select all
            </label>
          </div>

          <div style={s.toolbar}>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={s.searchInput}
            />
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              style={s.filterSelect}
            >
              <option value="all">All sizes</option>
              <option value="10mb">&gt; 10 MB</option>
              <option value="100mb">&gt; 100 MB</option>
              <option value="1gb">&gt; 1 GB</option>
            </select>
            <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>
              {filteredDuplicates.length} result{filteredDuplicates.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredDuplicates.length > 0 ? (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th} />
                      <th
                        style={sortField === "name" ? s.thActive : s.th}
                        onClick={() => toggleSort("name")}
                      >
                        Name{renderSortArrow("name")}
                      </th>
                      <th
                        style={sortField === "size" ? s.thActive : s.th}
                        onClick={() => toggleSort("size")}
                      >
                        Size{renderSortArrow("size")}
                      </th>
                      <th style={s.th}>MD5 / Signature</th>
                      <th style={s.th}>Duplicate of</th>
                      <th
                        style={sortField === "createdTime" ? s.thActive : s.th}
                        onClick={() => toggleSort("createdTime")}
                      >
                        Created{renderSortArrow("createdTime")}
                      </th>
                      <th style={s.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDuplicates.map((f) => (
                      <tr key={f.id}>
                        <td style={s.td}>
                          <input
                            type="checkbox"
                            style={s.checkbox}
                            checked={selected.has(f.id)}
                            onChange={() => toggleSelect(f.id)}
                          />
                        </td>
                        <td style={s.td}>{f.name}</td>
                        <td style={s.td}>
                          {f.size ? (parseInt(f.size, 10) / 1048576).toFixed(1) + " MB" : "—"}
                        </td>
                        <td style={s.td}>
                          <span style={s.hash} title={f.signature}>
                            {f.signature?.substring(0, 12)}...
                          </span>
                        </td>
                        <td style={{ ...s.td, color: "#6ee7b7", fontSize: 12 }}>
                          {f.primaryName || f.duplicateOf?.substring(0, 10)}
                        </td>
                        <td style={{ ...s.td, color: "#6b7280", fontSize: 12 }}>
                          {f.createdTime ? new Date(f.createdTime).toLocaleDateString() : "—"}
                        </td>
                        <td style={s.td}>
                          <button
                            style={s.iconBtn}
                            onClick={() => handleDelete([f.id])}
                            title="Move to trash"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div style={s.pagination}>
                  <button
                    style={s.pageBtn}
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  {renderPageNumbers()}
                  <button
                    style={s.pageBtn}
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={s.empty}>
              {scanResult
                ? searchTerm || sizeFilter !== "all"
                  ? "No files match your filters."
                  : "No duplicates found. Your drive is clean!"
                : 'Click "Scan Drive" to analyze your Google Drive.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
