import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  Modal,
  LinearProgress,
  Fade,
} from "@mui/material";
import {


  Search,
  Bell,

  FileText,
  Activity,
  Layers,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import axios from "axios";

// --- 1. THEME & INTERFACES ---
const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    primary: { main: "#2563EB" },
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    h6: { fontWeight: 800, fontSize: "15px" },
  },
  shape: { borderRadius: 8 },
});

interface Candidate {
  _id: string;
  name: string;
  email: string;
  status: "Applied" | "Interview" | "Rejected" | "Hired";
  aiScore: number;
  aiAnalysis: string;
  appliedDate: string;
}

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Data
  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hr/dashboard");
      setCandidates(res.data.candidates);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  // Update Candidate Status (Kanban Logic)
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/hr/status/${id}`, {
        status: newStatus,
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 2. STICKY MINIMALIST NAVBAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#FFF",
          borderBottom: "1px solid #E2E8F0",
          top: 0,
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: "#2563EB",
                display: "flex",
              }}
            >
              <ShieldCheck size={20} color="#FFF" />
            </Box>
            <Typography
              variant="h6"
              color="#1E293B"
              sx={{ letterSpacing: -0.5 }}
            >
              HR-PULSE <span style={{ color: "#2563EB" }}>AI</span>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small">
              <Search size={20} />
            </IconButton>
            <IconButton size="small">
              <Bell size={20} />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button
              variant="contained"
              size="small"
              disableElevation
              sx={{ fontWeight: 800 }}
            >
              ADMIN PORTAL
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, width: "100%", maxWidth: "1700px", margin: "0 auto" }}>
        {/* 3. CAPABILITIES ONE-LINERS */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "AI Gap Analysis", icon: <BrainCircuit size={16} /> },
            { label: "Automated Kanban", icon: <Layers size={16} /> },
            { label: "Predictive Matching", icon: <Activity size={16} /> },
          ].map((tool, i) => (
            <Paper
              key={i}
              variant="outlined"
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderColor: "#E2E8F0",
                bgcolor: "#FFF",
              }}
            >
              <Box sx={{ color: "#2563EB", display: "flex" }}>{tool.icon}</Box>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ fontSize: "12px" }}
              >
                {tool.label}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* 4. MAIN KANBAN BOARD */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {["Applied", "Interview", "Rejected", "Hired"].map((col) => (
            <Box key={col}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2, px: 1 }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  color="#64748B"
                >
                  {col.toUpperCase()}
                </Typography>
                <Chip
                  label={candidates.filter((c) => c.status === col).length}
                  size="small"
                  sx={{ fontWeight: 900, height: 20, fontSize: 10 }}
                />
              </Stack>

              <Stack spacing={2}>
                {candidates
                  .filter((c) => c.status === col)
                  .map((cand) => (
                    <Paper
                      key={cand._id}
                      elevation={0}
                      onClick={() => setSelectedCandidate(cand)}
                      sx={{
                        p: 2,
                        border: "1px solid #E2E8F0",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "#2563EB",
                          transform: "translateY(-2px)",
                        },
                        transition: "0.2s",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1.5}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            bgcolor: "#F1F5F9",
                            color: "#1E293B",
                            fontWeight: 800,
                          }}
                        >
                          {cand.name[0]}
                        </Avatar>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="caption"
                            fontWeight={900}
                            sx={{ color: getScoreColor(cand.aiScore) }}
                          >
                            {cand.aiScore}% MATCH
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={cand.aiScore}
                            sx={{
                              width: 60,
                              height: 4,
                              borderRadius: 2,
                              mt: 0.5,
                              bgcolor: "#F1F5F9",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: getScoreColor(cand.aiScore),
                              },
                            }}
                          />
                        </Box>
                      </Stack>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="#1E293B"
                      >
                        {cand.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{ mb: 2 }}
                      >
                        {cand.email}
                      </Typography>

                      <Divider sx={{ mb: 1.5, borderStyle: "dashed" }} />

                      <Stack direction="row" spacing={0.5}>
                        {col !== "Hired" && (
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(
                                cand._id,
                                col === "Applied" ? "Interview" : "Hired",
                              );
                            }}
                            sx={{ fontSize: 10, fontWeight: 800 }}
                          >
                            Advance
                          </Button>
                        )}
                        {col !== "Rejected" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(cand._id, "Rejected");
                            }}
                            sx={{ fontSize: 10, fontWeight: 800 }}
                          >
                            Reject
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 5. AI DETAIL MODAL */}
      <Modal
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      >
        <Fade in={!!selectedCandidate}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: 600 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 4,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "#2563EB" }}>
                <FileText />
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedCandidate?.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {selectedCandidate?.email}
                </Typography>
              </Box>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#F8FAFC",
                borderLeft: "5px solid #2563EB",
                mb: 3,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <BrainCircuit size={18} color="#2563EB" />
                <Typography variant="subtitle2" fontWeight={800}>
                  AI STRUCTURAL AUDIT
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  color: "#334155",
                  fontSize: "13px",
                }}
              >
                {selectedCandidate?.aiAnalysis}
              </Typography>
            </Paper>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setSelectedCandidate(null)}
              sx={{ fontWeight: 800 }}
            >
              Close Review
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* FOOTER */}
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          borderTop: "1px solid #E2E8F0",
          bgcolor: "#FFF",
          mt: 4,
        }}
      >
        <Typography variant="caption" fontWeight={800} color="textSecondary">
          HR-PULSE INTELLIGENCE NODE v6.0 • PORT 5000
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
